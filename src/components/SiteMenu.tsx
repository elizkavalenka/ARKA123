import { useEffect, useRef, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import HoverFillLogo from '@/components/HoverFillLogo';
import ResponsiveImage from '@/components/ResponsiveImage';
import { LOCATION_IMAGE_SRC, NAV_LINKS } from '@/data/site';

type SiteMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function SiteMenu({ open, onClose }: SiteMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-label="Меню сайта"
      className="m-0 h-dvh max-h-dvh w-[min(560px,88vw)] max-w-none bg-ink-900 p-0 text-white backdrop:bg-ink-950/60 backdrop:[backdrop-filter:blur(5px)]"
    >
      {open && (
        <div className="relative flex h-full flex-col justify-between overflow-hidden px-8 py-8 animate-menu-reveal sm:px-12 sm:py-12">
          <div className="flex items-center justify-between">
            <HoverFillLogo className="w-[150px]" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть меню"
              className="flex h-11 w-11 items-center justify-center border border-white/30 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink-900"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav aria-label="Основная навигация">
            <p className="eyebrow mb-6 text-stone-300">Навигация</p>
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, index) => (
                <li key={link.href} className="border-t border-white/15 last:border-b">
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center justify-between py-5 text-[28px] font-medium leading-[1.15] transition-colors duration-300 hover:text-stone-300 sm:text-[36px]"
                  >
                    <span>{link.label}</span>
                    <span className="eyebrow text-stone-300 transition-transform duration-300 group-hover:translate-x-1">
                      0{index + 1}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-[1fr_auto] items-end gap-6">
            <div>
              <p className="eyebrow mb-3 text-stone-300">Адрес</p>
              <p className="text-base leading-[1.5] text-white">
                Минск, ул. Мстиславца, 10
                <br />
                напротив Национальной библиотеки Беларуси
              </p>
            </div>
            <ResponsiveImage
              src={LOCATION_IMAGE_SRC}
              alt=""
              aria-hidden="true"
              sizes="128px"
              className="hidden h-20 w-32 object-cover sm:block"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
