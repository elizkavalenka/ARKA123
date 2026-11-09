import { memo } from 'react';
import { PRELOADER_PATHS } from '@/data/logo';

const LETTER_STEP_MS = 200;
const FILL_DELAY_MS = 650;

interface BrandMarkProps {
  /** Letter-by-letter outline drawing followed by fill, used by the preloader. */
  animated?: boolean;
}

function BrandMark({ animated = false }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 1897 632"
      aria-hidden
      focusable="false"
      className="block h-auto w-[70vw] max-w-none fill-white md:w-[380px] lg:w-[440px]"
    >
      {PRELOADER_PATHS.map((d, i) => {
        const start = i * LETTER_STEP_MS;
        return (
          <path
            key={i}
            d={d}
            fillRule="evenodd"
            pathLength={1}
            className={animated ? 'brand-letter' : undefined}
            style={animated ? { animationDelay: `${start}ms, ${start + FILL_DELAY_MS}ms` } : undefined}
          />
        );
      })}
    </svg>
  );
}

export default memo(BrandMark);
