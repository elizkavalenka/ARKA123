import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'ended';

type BrandStoryVideoProps = {
  src: string;
  mobileSrc: string;
  poster: string;
  mobilePoster: string;
};

const PRELOAD_MARGIN = '600px';
const VISIBLE_RATIO_THRESHOLD = 0.3;
const MOBILE_QUERY = '(max-width: 767px)';

export default function BrandStoryVideo({
  src,
  mobileSrc,
  poster,
  mobilePoster,
}: BrandStoryVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const activeSrc = isMobile ? mobileSrc : src;
  const activePoster = isMobile ? mobilePoster : poster;

  const [nearViewport, setNearViewport] = useState(false);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    preloadObserver.observe(node);

    return () => preloadObserver.disconnect();
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    const video = videoRef.current;
    if (!node || !video) return;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < VISIBLE_RATIO_THRESHOLD && !video.paused) {
          video.pause();
        }
      },
      { threshold: VISIBLE_RATIO_THRESHOLD },
    );
    visibilityObserver.observe(node);

    return () => visibilityObserver.disconnect();
  }, []);

  const startPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (status === 'ended') {
      video.currentTime = 0;
    }

    video.play().catch(() => setStatus('ended'));
  };

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      startPlayback();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const isStarted = status === 'playing' || status === 'paused';
  const isPlaying = status === 'playing';

  const controls = (
    <div className="flex items-center gap-4 text-[#f7f3ec]">
      <button
        type="button"
        onClick={togglePause}
        aria-label={isPlaying ? 'Приостановить видео' : 'Смотреть историю'}
        className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-current transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:h-16 md:w-16 motion-reduce:transform-none"
      >
        <Play aria-hidden className={`absolute h-4 w-4 translate-x-[1px] fill-current transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
        <Pause aria-hidden className={`absolute h-4 w-4 fill-current transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
      </button>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Включить звук' : 'Выключить звук'}
        aria-pressed={muted}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/75 text-white transition-colors duration-300 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
      >
        {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
      </button>
      <span className="text-sm font-medium tracking-wide">Смотреть историю</span>
    </div>
  );

  return (
    <div ref={containerRef} className="relative flex w-full flex-col md:block">
      <div className="px-6 pb-8 pt-24 text-[#f7f3ec] sm:px-10 md:hidden">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-300">История бренда</p>
        <h2 className="mt-4 text-[30px] font-medium leading-[1.15] tracking-[-0.01em] sm:text-[36px]">
          Пространство начинается с людей.
        </h2>
      </div>

      <div
        className="relative mx-auto h-[min(177.78vw,78svh)] w-[min(100%,43.875svh)] overflow-hidden bg-ink-950 md:mx-0 md:aspect-video md:h-auto md:w-full"
      >
        <video
          ref={videoRef}
          src={nearViewport ? activeSrc : undefined}
          poster={activePoster}
          preload="metadata"
          playsInline
          aria-label="Видео о пространстве ARKA 123"
          onPlay={() => setStatus('playing')}
          onPause={() => setStatus((current) => (current === 'ended' ? current : 'paused'))}
          onEnded={() => setStatus('ended')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${status === 'ended' ? 'opacity-0' : 'opacity-100'} md:object-cover md:object-center`}
        />

        {status === 'ended' && (
          <button
            type="button"
            onClick={startPlayback}
            aria-label="Посмотреть историю ещё раз"
            className="absolute inset-0 z-10 block h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
          >
            <img src={activePoster} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-ink-950/10">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white text-white">
                <Play className="h-5 w-5 translate-x-px fill-current" aria-hidden />
              </span>
            </span>
          </button>
        )}

        <div className="pointer-events-none absolute inset-0 hidden flex-col justify-center px-6 text-[#f7f3ec] md:flex md:px-[6vw] lg:px-[6vw]">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-ink-950/40 to-transparent"
          />
          <div
            className={`relative flex flex-col gap-8 transition-opacity duration-500 motion-reduce:transition-none ${isStarted ? 'opacity-0' : 'opacity-100'}`}
          >
            <h2 className="text-[44px] font-medium leading-[1.15] tracking-[-0.01em] lg:text-[56px] xl:text-[64px]">
              <span className="block">Пространство</span>
              <span className="block">начинается</span>
              <span className="block">с людей.</span>
            </h2>
          </div>
          <div className="pointer-events-auto relative mt-10">{controls}</div>
        </div>
      </div>

      <div className="px-6 pb-16 pt-8 sm:px-10 md:hidden">{controls}</div>
    </div>
  );
}
