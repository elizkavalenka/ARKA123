import { useCallback, useState } from 'react';
import VirtualTourModal from './VirtualTourModal';

export interface VirtualTourSectionProps {
  /** Real still frame from the approved ARKA 123 3D model. */
  poster?: string;
  /** Public URL of the standalone Three.js tour. */
  tourSrc?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  className?: string;
}

/** Editorial introduction section with an on-demand fullscreen 3D tour. */
export default function VirtualTourSection({
  poster,
  tourSrc = '/virtual-tour/index.html',
  eyebrow = 'ARKA 123 / VIRTUAL EXPERIENCE',
  title = 'Пространство в перспективе.',
  description = 'Исследуйте архитектуру АРКА 123. Пройдите по пространству, рассмотрите детали и почувствуйте его атмосферу.',
  buttonLabel = 'Исследовать пространство',
  className = '',
}: VirtualTourSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openTour = useCallback(() => setIsOpen(true), []);
  const closeTour = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <section
        className={`relative isolate overflow-hidden bg-[#203642] text-white py-20 sm:py-24 lg:py-28 ${className}`.trim()}
        aria-labelledby="arka-tour-title"
      >
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
          <div className="mb-8 max-w-3xl sm:mb-10 lg:mb-14">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-white/55 sm:text-xs">
              {eyebrow}
            </p>
            <h2
              id="arka-tour-title"
              className="max-w-3xl text-[clamp(2.5rem,6vw,6.5rem)] font-light leading-[0.98] tracking-[-0.055em] text-white"
            >
              {title}
            </h2>
            <p className="mt-6 max-w-xl text-sm font-light leading-7 text-white/70 sm:text-base sm:leading-8">
              {description}
            </p>
          </div>

          <div className="group relative isolate min-h-[340px] overflow-hidden bg-[#11191d] sm:min-h-[460px] lg:min-h-[min(66vw,760px)]">
            {poster ? (
              <img
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
                src={poster}
                alt="Интерьер пространства АРКА 123"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(ellipse_at_50%_45%,#52636a_0%,#263940_42%,#10191e_100%)] p-6 sm:p-10"
                aria-hidden="true"
              >
                <span className="text-[clamp(2rem,7vw,6rem)] font-light tracking-[-0.07em] text-white/80">
                  АРКА 123
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                  123 M² · MINSK
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#071014]/85 via-[#071014]/15 to-[#071014]/10" />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/75 sm:inset-x-8 sm:top-8 sm:text-[10px]">
              <span>360° Virtual Experience</span>
              <span className="hidden sm:inline">Interactive tour ↗</span>
            </div>

            <div className="absolute inset-x-5 bottom-6 flex flex-col items-start justify-end gap-5 sm:inset-x-8 sm:bottom-9 sm:flex-row sm:items-end sm:justify-between lg:inset-x-12 lg:bottom-12">
              <div className="max-w-md">
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/55">
                  ARKA 123 · MINSK
                </p>
                <p className="text-xl font-light tracking-[-0.025em] text-white sm:text-2xl">
                  Архитектура, которую можно исследовать.
                </p>
              </div>
              <button
                className="inline-flex min-h-12 w-full items-center justify-between gap-8 border border-white/70 bg-white px-5 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-[#203642] transition-colors duration-300 hover:border-white hover:bg-[#203642] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#203642] sm:w-auto sm:min-w-[270px]"
                type="button"
                onClick={openTour}
                aria-haspopup="dialog"
              >
                <span>{buttonLabel}</span>
                <span aria-hidden="true" className="text-lg leading-none">↗</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-2 text-[9px] uppercase tracking-[0.18em] text-white/45 sm:flex-row sm:items-center">
            <p>Виртуальный осмотр пространства · АРКА 123, Минск</p>
            <p>Explore the space · 360°</p>
          </div>
        </div>
      </section>

      <VirtualTourModal open={isOpen} onClose={closeTour} tourSrc={tourSrc} />
    </>
  );
}
