import { useRef, useState, type TouchEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import ResponsiveImage from '@/components/ResponsiveImage';
import { useElementRect } from '@/hooks/useElementRect';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SCENARIOS } from '@/data/site';

const PINNED_QUERY = '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';
const SWIPE_THRESHOLD_PX = 50;
const LAST_INDEX = SCENARIOS.length - 1;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ScenariosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinned = useMediaQuery(PINNED_QUERY);
  const rect = useElementRect(sectionRef, pinned);
  const [manualIndex, setManualIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const travel = rect.height - rect.viewportHeight;
  const pinnedProgress = pinned && travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
  const pinnedIndex = Math.min(LAST_INDEX, Math.floor(pinnedProgress * SCENARIOS.length));
  const activeIndex = pinned ? pinnedIndex : manualIndex;
  const active = SCENARIOS[activeIndex];

  const selectScenario = (next: number) => {
    const target = clamp(next, 0, LAST_INDEX);
    if (!pinned) {
      setManualIndex(target);
      return;
    }
    const targetTop = -((target + 0.5) / SCENARIOS.length) * travel;
    window.scrollBy({ top: rect.top - targetTop, behavior: 'smooth' });
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) {
      return;
    }
    const deltaX = event.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      selectScenario(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
    }
  };

  return (
    <section
      id="scenarios"
      ref={sectionRef}
      className={`bg-stone-50 ${pinned ? 'h-[340vh]' : 'py-24 lg:py-32'}`}
    >
      <div className={pinned ? 'sticky top-0 flex h-[100svh] items-center pb-8 pt-24' : ''}>
        <div
          className={`mx-auto grid w-full max-w-[1440px] gap-10 px-5 lg:grid-cols-12 lg:px-10 ${
            pinned ? 'h-[min(calc(100svh-8rem),820px)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10' : 'lg:gap-x-16'
          }`}
        >
          <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
            <SectionHeading label="Сценарии" title="Один зал, четыре сценария" />
          </div>

          <div
            className="relative min-h-[320px] overflow-hidden bg-stone-200 sm:min-h-[420px] lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:min-h-0"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {SCENARIOS.map((scenario, index) => (
              <ResponsiveImage
                key={scenario.index}
                src={scenario.image.replace(/\.png$/, '.webp')}
                fallbackSrc={scenario.image}
                sizes="(min-width: 1024px) 60vw, 100vw"
                alt={index === activeIndex ? scenario.alt : ''}
                aria-hidden={index !== activeIndex}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <p className="eyebrow absolute bottom-4 left-4 bg-ink-900/80 px-3 py-2 text-white">
              Сценарий {active.index}
            </p>
          </div>

          <div className="flex flex-col justify-end gap-8 lg:col-span-4 lg:col-start-1 lg:row-start-2">
            <div key={active.index} className="animate-menu-reveal">
              <p className="eyebrow mb-3 text-brand">Сценарий {active.index}</p>
              <h3 className="text-[26px] font-medium leading-[1.15] text-charcoal lg:text-[32px]">
                {active.title}
              </h3>
              <p className="mt-4 text-base leading-[1.625] text-stone-700">{active.text}</p>
            </div>

            <div className="flex items-center justify-between border-t border-stone-300 pt-6">
              <ul className="flex gap-1">
                {SCENARIOS.map((scenario, index) => (
                  <li key={scenario.index}>
                    <button
                      type="button"
                      onClick={() => selectScenario(index)}
                      aria-pressed={index === activeIndex}
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                        index === activeIndex ? 'bg-brand text-white' : 'text-stone-600 hover:text-charcoal'
                      }`}
                    >
                      {scenario.index}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => selectScenario(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Предыдущий сценарий"
                  className="flex h-11 w-11 items-center justify-center border border-stone-300 text-charcoal transition-colors duration-300 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => selectScenario(activeIndex + 1)}
                  disabled={activeIndex === LAST_INDEX}
                  aria-label="Следующий сценарий"
                  className="flex h-11 w-11 items-center justify-center border border-stone-300 text-charcoal transition-colors duration-300 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
