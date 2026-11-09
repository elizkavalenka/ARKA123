import { ArrowUpRight } from 'lucide-react';
import HoverFillLogo from '@/components/HoverFillLogo';
import { NAV_LINKS } from '@/data/site';

const ADDRESS_QUERY = 'Минск, улица Мстиславца, 10';
// Яндекс.Карты — карта из конструктора (с закреплённой меткой ARKA 123).
const MAP_EMBED_SRC =
  'https://yandex.ru/map-widget/v1/?um=constructor%3Ac064d08d2afd12c2b8486c70e87af8060e1204497645a5fb7e5f6bcc592d30d7&source=constructor';
// Ссылка «построить маршрут» — открывает полноценные Яндекс.Карты.
const MAP_ROUTE_SRC = `https://yandex.ru/maps/?text=${encodeURIComponent(ADDRESS_QUERY)}`;

// Тонировка карты под палитру футера (accent #203642). Легко настраивается.
const MAP_FILTER =
  'grayscale(1) brightness(0.72) contrast(1.08) sepia(0.55) hue-rotate(155deg) saturate(1.5)';

export default function SiteFooter() {
  return (
    <footer
      id="contacts"
      className="relative isolate flex min-h-[560px] flex-col overflow-hidden bg-stone-600 text-white lg:min-h-[620px]"
    >
      {/* Слой 1 — карта на весь футер, тонирована под бренд. */}
      <iframe
        title="Яндекс.Карты: ул. Мстиславца, 10 — как добраться до ARKA 123"
        src={MAP_EMBED_SRC}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        // На мобильных карта неинтерактивна (pointer-events-none), чтобы не
        // перехватывать скролл страницы пальцем; на lg+ — кликабельна.
        className="pointer-events-none absolute inset-0 h-full w-full border-0 lg:pointer-events-auto"
        style={{ filter: MAP_FILTER }}
      />

      {/* Слой 2 — скримы (pointer-events-none — клики проходят на карту). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(32,54,66,0.97)_0%,rgba(32,54,66,0.9)_26%,rgba(32,54,66,0.55)_52%,rgba(32,54,66,0.22)_78%,rgba(32,54,66,0.12)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(41,37,36,0.85)_0%,rgba(41,37,36,0.2)_22%,transparent_46%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_40px_rgba(12,10,9,0.55)]"
      />

      {/* Кнопка маршрута на карте. */}
      <a
        href={MAP_ROUTE_SRC}
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute bottom-[96px] right-5 z-[11] hidden items-center gap-2 rounded-full border border-white/25 bg-ink-900/70 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur transition-colors duration-300 hover:bg-ink-900/90 lg:right-10 lg:inline-flex"
      >
        Построить маршрут
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      </a>

      {/* Слой 3 — контент поверх карты. pointer-events только на интерактиве,
          чтобы карта оставалась кликабельной в свободной зоне. */}
      <div className="pointer-events-none relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-[72px] lg:px-10 lg:py-[88px]">
          <div className="flex max-w-[440px] flex-col gap-7 lg:gap-8">
            <HoverFillLogo className="pointer-events-auto w-[200px] lg:w-[240px]" />

            <p className="max-w-sm text-base leading-[1.65] text-white/90">
              Камерное пространство для лекций, мастер-классов и частных событий в самом
              центре Минска.
            </p>

            <div>
              <p className="eyebrow mb-3 text-white/60">Адрес</p>
              <p className="text-base leading-[1.65] text-white">
                ул. Мстиславца, 10
                <br />
                Минск, Беларусь
              </p>
              <p className="mt-2 text-base leading-[1.65] text-white/70">Напротив Национальной библиотеки</p>
            </div>

            <a
              href="#booking"
              className="group pointer-events-auto inline-flex w-fit items-center gap-3 bg-white px-6 py-4 text-sm font-medium text-ink-900 transition-colors duration-300 hover:bg-stone-200"
            >
              Забронировать пространство
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </a>

            <nav aria-label="Навигация по сайту">
              <ul className="flex flex-wrap gap-x-7 gap-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="pointer-events-auto text-base text-white/85 transition-opacity duration-300 hover:opacity-100"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Маршрут на мобильных — в потоке (не налезает на меню). */}
            <a
              href={MAP_ROUTE_SRC}
              target="_blank"
              rel="noopener noreferrer"
              className="group pointer-events-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-ink-900/70 py-2.5 px-4 text-[13px] font-semibold text-white backdrop-blur transition-colors duration-300 hover:bg-ink-900/90 lg:hidden"
            >
              Построить маршрут
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Нижняя полоса — поверх карты, с полупрозрачной подложкой. */}
      <div className="relative z-10 border-t border-white/20 bg-stone-800/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-6 text-sm text-white sm:flex-row sm:items-center sm:justify-between sm:gap-3 lg:px-10">
          <p>© {new Date().getFullYear()} ARKA 123</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="/privacy" className="hover:opacity-75">
              Политика обработки персональных данных
            </a>
            <p>Пространство 123 м² в Минске</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
