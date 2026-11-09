import { useCallback, useEffect, useRef, useState } from 'react';

export interface VirtualTourModalProps {
  open: boolean;
  onClose: () => void;
  tourSrc?: string;
  title?: string;
}

/** Fullscreen viewer. The iframe isolates the tour's Three.js runtime and styles. */
export default function VirtualTourModal({
  open,
  onClose,
  tourSrc = '/virtual-tour/index.html',
  title = 'Виртуальный тур АРКА 123',
}: VirtualTourModalProps) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const close = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.warn('Could not exit fullscreen:', error);
      }
    }
    onClose();
  }, [onClose]);

  const enterFullscreen = useCallback(async () => {
    const node = dialogRef.current;
    if (!node || document.fullscreenElement) return;
    try {
      await node.requestFullscreen?.();
    } catch (error) {
      console.warn('Fullscreen mode is unavailable:', error);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.fullscreenElement) close();
    };
    const handleFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      setLoaded(false);
      setFullscreen(false);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen items-center justify-center bg-[#080d10]/95 p-0 backdrop-blur-sm sm:p-4 md:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) void close();
      }}
    >
      <section
        ref={dialogRef}
        className={`relative isolate h-[100dvh] w-full max-w-[1440px] overflow-hidden bg-black shadow-[0_24px_100px_rgba(0,0,0,0.45)] sm:h-[min(88dvh,1000px)] ${fullscreen ? '!fixed !inset-0 !h-[100dvh] !w-screen !max-w-none !rounded-none' : 'sm:rounded-[2px]'}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {!loaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#10191e] text-white" aria-live="polite">
            <span className="h-8 w-8 animate-spin rounded-full border border-white/20 border-t-white" />
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/65">
              Подготавливаем пространство
            </span>
          </div>
        )}

        <iframe
          className="absolute inset-0 h-full w-full border-0 bg-black"
          src={tourSrc}
          title={title}
          allow="fullscreen; autoplay; xr-spatial-tracking"
          allowFullScreen
          loading="eager"
          onLoad={() => setLoaded(true)}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-end gap-2 p-3 sm:p-5">
          <button
            ref={closeRef}
            className="pointer-events-auto grid h-11 w-11 place-items-center border border-white/25 bg-[#10191e]/65 text-3xl font-extralight leading-none text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-[#203642] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            type="button"
            onClick={() => void close()}
            aria-label="Закрыть виртуальный тур"
            title="Закрыть"
          >
            <span aria-hidden="true">×</span>
          </button>
          <button
            className="pointer-events-auto grid h-11 w-11 place-items-center border border-white/25 bg-[#10191e]/65 text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-[#203642] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={() => void enterFullscreen()}
            aria-label="Развернуть на весь экран"
            title="На весь экран"
            disabled={fullscreen}
          >
            <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
              <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
