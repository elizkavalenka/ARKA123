import { useEffect, useState, type RefObject } from 'react';

export type ElementRect = { top: number; height: number; viewportHeight: number };

const EMPTY_RECT: ElementRect = { top: 0, height: 0, viewportHeight: 0 };

export function useElementRect(ref: RefObject<HTMLElement>, enabled: boolean): ElementRect {
  const [rect, setRect] = useState<ElementRect>(EMPTY_RECT);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const element = ref.current;
      if (!element) {
        return;
      }
      const box = element.getBoundingClientRect();
      const next = { top: box.top, height: box.height, viewportHeight: window.innerHeight };
      setRect((current) =>
        current.top === next.top && current.height === next.height && current.viewportHeight === next.viewportHeight
          ? current
          : next,
      );
    };
    const requestMeasure = () => {
      if (!frame) {
        frame = requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', requestMeasure, { passive: true });
    window.addEventListener('resize', requestMeasure);
    return () => {
      window.removeEventListener('scroll', requestMeasure);
      window.removeEventListener('resize', requestMeasure);
      cancelAnimationFrame(frame);
    };
  }, [ref, enabled]);

  return enabled ? rect : EMPTY_RECT;
}
