# ARKA 123 — доработки по аудиту (текущая серия)

## 1. Reduced Motion в Hero
`src/components/HeroSection.tsx`: при `prefers-reduced-motion: reduce` вместо
`<video>` теперь рендерится статичный постер (`<img>`
`images-web-03.webp`) на весь экран. Никакой scroll-scrubbing-анимации
не создаётся. В обычном режиме поведение не изменилось.

## 2. Предрендеринг SPA
`vite.config.ts`: подключён `@prerenderer/rollup-plugin` с puppeteer-рендерером.
На `vite build` для маршрутов `/` и `/privacy` генерируется готовый
HTML (`dist/index.html`, `dist/privacy/index.html`) — для краулеров и быстрого
первого кадра. Бандл остаётся тем же — он гидрирует поверх разметки.
`vite dev` не затрагивается. Добавлены devDependencies:
`@prerenderer/rollup-plugin`, `@prerenderer/renderer-puppeteer`, `puppeteer`.

> Важно: puppeteer при установке скачивает Chromium. В ограниченном CI
> может понадобиться системный Chrome (`executablePath`). Конфиг
> добавлен, но реальный `vite build` здесь не проверялся (нет node_modules).

## 3. Поддержка WebP
WebP поддерживается ~97% браузеров: Chrome/Edge, Firefox, Safari 14+
(macOS Big Sur / iOS 14+, осень 2020), все современные Android. НЕ поддерживают:
IE11 и Safari ≤ 13 / iOS ≤ 13. Для этого <1% в `ScenariosSection`
сохранён PNG-fallback через `<picture>`.

## 4. Удалённый неиспользуемый код (картинки не трогали)
- `src/components/ArkaLogo.tsx`
- `src/data/logoSymbolOutline.ts`
- `src/lib/drawOutline.ts`
- CSS-правила `.logo-reveal__*` и keyframe `logo-region-in` в `src/index.css`

`.brand-letter` оставлен — его использует `BrandMark`.

## 5. WebP/AVIF + responsive images
- Крупные PNG (~2.2 МБ) перекодированы в WebP: full (~1680w) + 840w-вариант.
  Пример: `scenario-floristry.png` 2.2 МБ → `.webp` ~150 КБ / `-840.webp` ~55 КБ;
  `images-web-09.png` 2 МБ → 88 КБ. PNG-оригиналы сохранены.
  AVIF не собирали: в среде нет `avifenc`/`cwebp`, только ffmpeg+libwebp.
- Новый компонент `src/components/ResponsiveImage.tsx` — `<picture>`+`srcSet`
  (840w/1680w) с `sizes` и опциональным PNG-fallback.
- Переведены на `ResponsiveImage`: `ScenariosSection`, `ArchitectureSection`,
  `AboutSection`, `SiteFooter`, `SiteMenu`.
