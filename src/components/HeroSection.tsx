import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useElementRect } from '@/hooks/useElementRect';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useHeroStageScroll } from '@/hooks/useHeroStageScroll';
import { HERO_VIDEO_MOBILE_MP4_SRC, HERO_VIDEO_MP4_SRC, HERO_VIDEO_POSTER_SRC } from '@/data/site';
import BrandMark from '@/components/BrandMark';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const MOBILE_QUERY = '(max-width: 767px)';
const SEEK_TOLERANCE_SECONDS = 0.03;
const HANDOVER_START = 0.005;
const HANDOVER_END = 0.06;
const SHIFT_PX = 16;
const FADE_OUT_END = 0.6;
const FADE_IN_START = 0.35;
const STAGE_STOPS = [0, 1 / 2, 1] as const;

function inertProps(inert: boolean) {
  return inert ? { inert: '' } : {};
}

function ramp(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

/**
 * Stage i is fully visible at STAGE_STOPS[i]. Between two stops the outgoing
 * stage fades out first and the incoming one fades in after, with only a short
 * overlap so the text never goes fully blank.
 */
function stageVisibility(progress: number, index: number) {
  const last = STAGE_STOPS.length - 1;
  const enter =
    index === 0 ? 1 : ramp(ramp(progress, STAGE_STOPS[index - 1], STAGE_STOPS[index]), FADE_IN_START, 1);
  const leave =
    index === last ? 1 : 1 - ramp(ramp(progress, STAGE_STOPS[index], STAGE_STOPS[index + 1]), 0, FADE_OUT_END);
  return enter * leave;
}

// type HeroSectionProps = {
//   onScrollCue: () => void;
//   onReverseCue: () => void;
//   isTransitioning: () => boolean;
// };

// export default function HeroSection({ onScrollCue, onReverseCue, isTransitioning }: HeroSectionProps) {
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const mp4Src = isMobile ? HERO_VIDEO_MOBILE_MP4_SRC : HERO_VIDEO_MP4_SRC;

  const rect = useElementRect(sectionRef, true);
  const travel = rect.height - rect.viewportHeight;
  const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
  useHeroStageScroll({
    sectionRef,
    stops: STAGE_STOPS,
    enabled: !reducedMotion,
  });

  const seekTargetRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || duration <= 0) {
      return;
    }

    // Respect prefers-reduced-motion: pin the hero video to a single static
    // frame instead of scrubbing it with the scroll position.
    if (reducedMotion) {
      seekTargetRef.current = 0;
      if (!video.seeking && Math.abs(video.currentTime - 0) > SEEK_TOLERANCE_SECONDS) {
        video.currentTime = 0;
      }
      return;
    }

    seekTargetRef.current = (1 - progress) * duration;

    if (video.seeking) {
      return;
    }

    if (Math.abs(video.currentTime - seekTargetRef.current) > SEEK_TOLERANCE_SECONDS) {
      video.currentTime = seekTargetRef.current;
    }
  }, [progress, duration, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const resyncAfterSeek = () => {
      if (Math.abs(video.currentTime - seekTargetRef.current) > SEEK_TOLERANCE_SECONDS) {
        video.currentTime = seekTargetRef.current;
      }
    };
    video.addEventListener('seeked', resyncAfterSeek);
    return () => video.removeEventListener('seeked', resyncAfterSeek);
  }, []);

  const handover = ramp(progress, HANDOVER_START, HANDOVER_END);
  const headerLogoOpacity = Math.round(handover * 100) / 100;

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--header-logo-opacity',
      String(headerLogoOpacity)
    );

    document.documentElement.style.setProperty(
      '--header-logo-pointer-events',
      headerLogoOpacity > 0.05 ? 'auto' : 'none'
    );
  }, [headerLogoOpacity]);

  const logoOpacity = stageVisibility(progress, 0);
  const emotionalOpacity = stageVisibility(progress, 1);
  const invitationOpacity = stageVisibility(progress, 2);

  const stageStyle = (opacity: number) => ({
    opacity,
    transform: `translate3d(0, ${(1 - opacity) * SHIFT_PX}px, 0)`,
  });

  return (
    <section id="top" ref={sectionRef} className="relative h-[200svh] bg-ink-950 lg:h-[225svh]">
      <h1 className="sr-only">ARKA 123 — камерное пространство 123 м² для встреч в Минске, напротив Национальной библиотеки</h1>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink-900 text-white">
        {reducedMotion ? (
          // prefers-reduced-motion: show the static poster frame instead of
          // the scroll-scrubbed <video>, so no motion is rendered at all.
          <img
            src={HERO_VIDEO_POSTER_SRC}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <>
            <img
              src={HERO_VIDEO_POSTER_SRC}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover md:hidden"
            />
            <video
              ref={videoRef}
              src={mp4Src}
              muted
              playsInline
              preload="metadata"
              poster={HERO_VIDEO_POSTER_SRC}
              aria-hidden="true"
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onLoadedData={(event) => {
                event.currentTarget.currentTime = seekTargetRef.current;
              }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </>
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/[0.07]" />
        {/* <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(
                108deg,
                rgba(24, 22, 20, 0.45) 0%,
                rgba(24, 22, 20, 0.42) 20%,
                rgba(24, 22, 20, 0.22) 38%,
                rgba(24, 22, 20, 0.07) 51%,
                transparent 64%
              )
            `,
          }}
        /> */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950/30 to-transparent" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-[opacity] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.18))_drop-shadow(0_6px_18px_rgba(0,0,0,0.14))]"
          style={{ opacity: logoOpacity }}
        >
          <BrandMark />
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto grid max-w-[1440px] px-5 pb-24 sm:px-10 lg:pb-28">
          <div
            className="col-start-1 row-start-1 max-w-3xl self-end will-change-[opacity,transform]"
            style={stageStyle(emotionalOpacity)}
            aria-hidden={emotionalOpacity < 0.5}
            {...inertProps(emotionalOpacity < 0.5)}
          >
            <p className="text-[clamp(28px,3.6vw,48px)] font-medium leading-[1.2] tracking-[-0.01em] text-white">
              Больше, чем просто пространство. Место для идей, диалога и живого общения.
            </p>
          </div>

          <div
            className="col-start-1 row-start-1 max-w-3xl self-end will-change-[opacity,transform]"
            style={stageStyle(invitationOpacity)}
            aria-hidden={invitationOpacity < 0.5}
            {...inertProps(invitationOpacity < 0.5)}
          >
            <p className="text-[clamp(28px,3.6vw,48px)] font-medium leading-[1.2] tracking-[-0.01em] text-white">
              Встречаемся напротив Библиотеки. 123 м² для вашего события.
            </p>
            <a
              href="#booking"
              className="group mt-10 inline-flex items-center gap-3 bg-white px-6 py-4 text-sm font-medium text-ink-900 transition-colors duration-300 hover:bg-stone-200"
            >
              Забронировать пространство
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </a>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-white/20">
          <div
            className="h-full origin-left bg-white"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        <a
          href="#space"
          aria-label="Листать к следующей секции"
          className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center text-[9px] font-normal uppercase tracking-[0.25em] text-white/75 transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="pl-[0.25em]">Листать</span>
          <span className="relative mt-2.5 block h-7 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-0 origin-top animate-scroll-cue bg-white" />
          </span>
          <svg
            aria-hidden
            viewBox="0 0 8 4"
            className="-mt-px h-1 w-2 animate-scroll-nudge"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path d="M0.5 0.5 4 3.5 7.5 0.5" />
          </svg>
        </a>
      </div>
    </section>
  );
}
