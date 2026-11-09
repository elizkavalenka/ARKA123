import { useEffect, useState } from 'react';
import BrandMark from '@/components/BrandMark';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const MIN_VISIBLE_MS = 1100;
const MAX_VISIBLE_MS = 3500;
const FADE_MS = 550;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Branded overlay shown once per fresh page load; the logo sits exactly where the hero logo does. */
export default function SitePreloader() {
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');

  useEffect(() => {
    if (reducedMotion) return;

    const start = performance.now();
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    const timers: number[] = [];
    let done = false;

    html.style.overflow = 'hidden';

    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      timers.push(
        window.setTimeout(() => {
          html.style.overflow = previousOverflow;
          setPhase('fading');
          timers.push(window.setTimeout(() => setPhase('gone'), FADE_MS));
        }, wait),
      );
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    timers.push(window.setTimeout(finish, MAX_VISIBLE_MS));

    return () => {
      window.removeEventListener('load', finish);
      timers.forEach((timer) => window.clearTimeout(timer));
      html.style.overflow = previousOverflow;
    };
  }, [reducedMotion]);

  if (reducedMotion || phase === 'gone') return null;

  return (
    <div
      role="status"
      aria-label="АРКА 123"
      className={`fixed inset-0 z-[100] bg-ink-900 transition-opacity ease-out ${
        phase === 'fading' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="absolute inset-x-0 top-0 flex h-[100svh] items-center justify-center">
        <BrandMark animated />
      </div>
    </div>
  );
}
