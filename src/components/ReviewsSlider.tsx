import { useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { REVIEWS } from '@/data/reviews';

const SWIPE_THRESHOLD_PX = 48;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export default function ReviewsSlider() {
  const [active, setActive] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const total = REVIEWS.length;

  const goTo = (index: number) => setActive(((index % total) + total) % total);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartX.current = event.pointerType === 'mouse' ? null : event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const startX = swipeStartX.current;
    swipeStartX.current = null;
    if (startX === null) return;

    const deltaX = event.clientX - startX;
    if (deltaX <= -SWIPE_THRESHOLD_PX) goTo(active + 1);
    else if (deltaX >= SWIPE_THRESHOLD_PX) goTo(active - 1);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Отзывы о пространстве"
      className="touch-pan-y select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        swipeStartX.current = null;
      }}
    >
      <div className="grid lg:grid-cols-12">
        {REVIEWS.map((review, index) => {
          const isActive = index === active;
          return (
            <figure
              key={review.quote}
              aria-hidden={!isActive}
              {...(isActive ? {} : { inert: '' })}
              className={`col-start-1 row-start-1 lg:col-span-10 lg:col-start-3 transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
                isActive ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
              }`}
            >
              <blockquote className="text-[20px] font-normal leading-[1.45] tracking-[-0.005em] text-charcoal sm:text-[24px] lg:text-[30px]">
                «{review.quote}»
              </blockquote>
              <figcaption className="eyebrow mt-8 text-brand">{review.format}</figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-between gap-6 border-t border-stone-300 pt-6 lg:ml-[16.666%] lg:mt-16">
        <div className="flex items-center gap-6">
          <p aria-live="polite" className="text-sm font-medium tabular-nums text-charcoal">
            {pad(active + 1)} / {pad(total)}
          </p>
          <div className="relative hidden h-px w-32 bg-stone-300 sm:block">
            <div
              className="absolute inset-y-0 left-0 w-full origin-left bg-brand transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${(active + 1) / total})` }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Предыдущий отзыв"
            className="flex h-11 w-11 items-center justify-center border border-stone-300 text-charcoal transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Следующий отзыв"
            className="flex h-11 w-11 items-center justify-center border border-stone-300 text-charcoal transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
