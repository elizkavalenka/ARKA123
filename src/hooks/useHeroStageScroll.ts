
import { useEffect, useRef, type RefObject } from 'react';

const WHEEL_THRESHOLD_PX = 40;
const TOUCH_THRESHOLD_PX = 30;
const GESTURE_IDLE_MS = 180;
const STAGE_ANIMATION_MS = 1100;
const FINAL_EDGE_TOLERANCE_PX = 4;

const DOWN_KEYS = ['ArrowDown', 'PageDown', ' '];
const UP_KEYS = ['ArrowUp', 'PageUp'];
const TEXT_ENTRY_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

interface StageScrollOptions {
  sectionRef: RefObject<HTMLElement>;
  stops: readonly number[];
  enabled: boolean;
}

export function easeInOutCubic(t: number) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function isTextEntry(target: EventTarget | null) {
  return target instanceof HTMLElement &&
    (target.isContentEditable || TEXT_ENTRY_TAGS.includes(target.tagName));
}

function nearestStage(progress: number, stops: readonly number[]) {
  let best = 0;

  for (let index = 1; index < stops.length; index += 1) {
    if (
      Math.abs(progress - stops[index]) <
      Math.abs(progress - stops[best])
    ) {
      best = index;
    }
  }

  return best;
}

export function useHeroStageScroll({
  sectionRef,
  stops,
  enabled,
}: StageScrollOptions) {
  const stageRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!enabled || !section) {
      return;
    }

    const lastStage = stops.length - 1;

    let animating = false;
    let animationFrame = 0;
    let accumulated = 0;
    let gestureLocked = false;
    let lastIntentAt = 0;
    let touchY: number | null = null;

    const geometry = () => {
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      const progress = travel > 0
        ? Math.min(1, Math.max(0, -rect.top / travel))
        : 0;

      return {
        top: rect.top,
        travel,
        progress,
      };
    };

    const isCapturing = () => {
      const { top, travel } = geometry();

      return (
        travel > 0 &&
        top <= 0 &&
        -top <= travel + FINAL_EDGE_TOLERANCE_PX
      );
    };

    const isPreloaderLocked = () =>
      document.documentElement.style.overflow === 'hidden';

    const animateToStage = (index: number) => {
      const { top, travel } = geometry();
      const start = window.scrollY;
      const end = start + top + stops[index] * travel;
      const startedAt = performance.now();

      animating = true;

      const step = (now: number) => {
        const t = Math.min(
          1,
          (now - startedAt) / STAGE_ANIMATION_MS
        );

        window.scrollTo(
          0,
          start + (end - start) * easeInOutCubic(t)
        );

        if (t < 1) {
          animationFrame = requestAnimationFrame(step);
          return;
        }

        animating = false;
        animationFrame = 0;
        lastIntentAt = performance.now();
      };

      animationFrame = requestAnimationFrame(step);
    };

    const moveToStage = (next: number) => {
      stageRef.current = Math.min(
        lastStage,
        Math.max(0, next)
      );

      animateToStage(stageRef.current);
    };

    const accumulate = (dy: number, threshold: number) => {
      if (Math.sign(dy) !== Math.sign(accumulated)) {
        accumulated = 0;
      }

      accumulated += dy;

      if (Math.abs(accumulated) < threshold) {
        return false;
      }

      accumulated = 0;
      return true;
    };

    const handleMovement = (
      dy: number,
      threshold: number,
      event: Event
    ) => {
      const goingDown = dy > 0;

      // На последней стадии разрешаем обычную прокрутку к следующей секции.
      if (goingDown && stageRef.current === lastStage) {
        return;
      }

      // На первой стадии разрешаем обычную прокрутку вверх.
      if (!goingDown && stageRef.current === 0) {
        return;
      }

      event.preventDefault();

      if (animating || gestureLocked || !accumulate(dy, threshold)) {
        return;
      }

      gestureLocked = true;

      moveToStage(
        stageRef.current + (goingDown ? 1 : -1)
      );
    };

    const onWheel = (event: WheelEvent) => {
      if (isPreloaderLocked()) {
        return;
      }

      const dy = event.deltaY *
        (event.deltaMode === 1 ? 16 : 1);

      if (dy === 0 || !isCapturing()) {
        return;
      }

      const now = performance.now();

      if (
        !animating &&
        now - lastIntentAt > GESTURE_IDLE_MS
      ) {
        gestureLocked = false;
        accumulated = 0;
      }

      lastIntentAt = now;

      handleMovement(dy, WHEEL_THRESHOLD_PX, event);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
      accumulated = 0;
      gestureLocked = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;

      if (
        touchY === null ||
        y === undefined ||
        isPreloaderLocked() ||
        !isCapturing()
      ) {
        return;
      }

      const dy = touchY - y;
      touchY = y;

      if (dy === 0) {
        return;
      }

      handleMovement(dy, TOUCH_THRESHOLD_PX, event);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isPreloaderLocked() ||
        isTextEntry(event.target) ||
        !isCapturing()
      ) {
        return;
      }

      const goingDown = DOWN_KEYS.includes(event.key);
      const goingUp = UP_KEYS.includes(event.key);

      if (!goingDown && !goingUp) {
        return;
      }

      if (
        (goingDown && stageRef.current === lastStage) ||
        (goingUp && stageRef.current === 0)
      ) {
        return;
      }

      event.preventDefault();

      if (animating) {
        return;
      }

      moveToStage(
        stageRef.current + (goingDown ? 1 : -1)
      );
    };

    const onScroll = () => {
      if (animating || !isCapturing()) {
        return;
      }

      stageRef.current = nearestStage(
        geometry().progress,
        stops
      );
    };

    stageRef.current = nearestStage(
      geometry().progress,
      stops
    );

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);

      cancelAnimationFrame(animationFrame);
    };
  }, [sectionRef, stops, enabled]);
}
