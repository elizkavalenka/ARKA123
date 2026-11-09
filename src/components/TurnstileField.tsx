import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void; 'error-callback'?: () => void; theme?: 'light' | 'dark' | 'auto' }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type Props = { onToken: (token: string) => void };

export default function TurnstileField({ onToken }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let widgetId: string | undefined;
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (!window.turnstile || !containerRef.current) {
        attempts += 1;
        if (attempts > 40) window.clearInterval(timer);
        return;
      }
      window.clearInterval(timer);
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      });
    }, 250);
    return () => {
      window.clearInterval(timer);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, onToken]);

  if (!siteKey) return <p className="text-xs text-red-800">Форма временно не активирована: необходимо настроить защиту от спама.</p>;
  return <div ref={containerRef} className="min-h-[65px]" />;
}
