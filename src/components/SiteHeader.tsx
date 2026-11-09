
import { useState } from 'react';
import { ArrowUpRight, Menu } from 'lucide-react';
import HoverFillLogo from '@/components/HoverFillLogo';
import SiteMenu from '@/components/SiteMenu';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = window.location.pathname === '/';

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-24 top-0 -z-10 bg-[linear-gradient(to_bottom,rgba(15,14,13,0.72)_0%,rgba(15,14,13,0.5)_35%,rgba(15,14,13,0.22)_65%,rgba(15,14,13,0.06)_85%,rgba(15,14,13,0)_100%)]"
        />

        <div className="mx-auto grid h-20 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 text-white lg:h-24 lg:px-10">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            aria-haspopup="dialog"
            className="group flex items-center gap-3 justify-self-start"
          >
            <Menu className="h-6 w-6" strokeWidth={1.5} />
            <span className="eyebrow hidden transition-opacity group-hover:opacity-70 lg:inline">
              Меню
            </span>
          </button>

          {/* HEADER LOGO */}
          <a
            href="/"
            onClick={handleLogoClick}
            aria-label="АРКА 123 — в начало страницы"
            className={`
              justify-self-center
              drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]
              transition-opacity duration-300
              ${isHomePage
                ? 'opacity-[var(--header-logo-opacity,0)]'
                : 'opacity-100'
              }
            `}
          >
            <HoverFillLogo className="w-[126px] lg:w-[190px]" />
          </a>

          <a
            href="#booking"
            className="group inline-flex items-center gap-2 justify-self-end border border-white/70 px-4 py-2.5 text-sm leading-none transition-colors duration-300 hover:bg-white hover:text-ink-900 lg:px-5 lg:py-3"
          >
            <span className="lg:hidden">Бронь</span>
            <span className="hidden lg:inline">Забронировать пространство</span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </header>

      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
