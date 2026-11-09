import SectionHeading from '@/components/SectionHeading';
import SectionCta from '@/components/SectionCta';
import { FACILITY_ITEMS } from '@/data/site';

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading label="Оснащение" title="Всё необходимое. И ничего лишнего." />
          <p className="text-base leading-[1.625] text-stone-700 lg:pb-2">
            Пространство ARKA 123 можно подготовить под разные сценарии использования. Мы учитываем количество
            участников, формат мероприятия и особенности организации.
          </p>
        </div>

        <ul className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {FACILITY_ITEMS.map((item) => (
            <li key={item.title} className="border-t border-stone-300 pt-8">
              <item.icon className="h-8 w-8 text-brand" strokeWidth={1.25} aria-hidden />
              <h3 className="mt-6 text-xl font-medium text-charcoal">{item.title}</h3>
              <p className="mt-3 text-sm leading-[1.625] text-stone-700">{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 lg:mt-20">
          <SectionCta href="#booking" label="Подобрать конфигурацию" />
        </div>
      </div>
    </section>
  );
}
