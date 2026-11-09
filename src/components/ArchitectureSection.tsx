import ResponsiveImage from '@/components/ResponsiveImage';
import { ARCHITECTURE_PHOTOS } from '@/data/site';

type ArchitecturePhoto = (typeof ARCHITECTURE_PHOTOS)[number];

const [mainPhoto, ...sidePhotos] = ARCHITECTURE_PHOTOS;

function PhotoFigure({
  photo,
  className,
  mediaClassName,
}: {
  photo: ArchitecturePhoto;
  className: string;
  mediaClassName: string;
}) {
  return (
    <figure className={`group flex flex-col ${className}`}>
      <div className={`relative overflow-hidden bg-stone-200 ${mediaClassName}`}>
        <ResponsiveImage
          src={photo.src}
          alt={photo.alt}
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-4 border-t border-stone-300 pt-4 text-sm font-medium text-charcoal">
        {photo.caption}
      </figcaption>
    </figure>
  );
}

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="bg-stone-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-0">
          <header className="lg:pr-12">
            <p className="eyebrow section-eyebrow mb-5 text-brand">Архитектура</p>
            <h2 className="text-[30px] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal sm:text-[36px] lg:text-[52px]">
              Свет, арки и честная геометрия
            </h2>
          </header>
          <p className="text-base leading-[1.6] text-stone-700 sm:text-lg lg:self-center lg:border-l lg:border-stone-300 lg:pl-12 lg:text-[17px]">
            Зал сохраняет архитектуру здания: арочные окна впускают дневной свет, а линейные светильники задают ритм
            потолка. Минимум декора оставляет главное — людей и их идеи.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-x-8">
          <PhotoFigure photo={mainPhoto} className="lg:col-span-6" mediaClassName="aspect-[4/5]" />
          <div className="flex flex-col gap-12 lg:col-span-5 lg:col-start-8 lg:mt-24">
            {sidePhotos.map((photo, index) => (
              <PhotoFigure
                key={photo.src}
                photo={photo}
                className=""
                mediaClassName={index === 0 ? 'aspect-[4/3]' : 'aspect-[4/3] lg:aspect-[16/10]'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
