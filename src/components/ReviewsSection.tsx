import SectionHeading from '@/components/SectionHeading';
import SectionCta from '@/components/SectionCta';
import ReviewsSlider from '@/components/ReviewsSlider';

export default function ReviewsSection() {
  return (
    <section id="reviews" className="bg-stone-50 py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading label="Отзывы" title="Ваша история может стать следующей" />
          </div>

          <div className="flex flex-col gap-8 border-stone-300 lg:col-span-5 lg:col-start-8 lg:border-l lg:pl-12">
            <div className="grid gap-5 text-base leading-[1.625] text-stone-700">
              <p>Мы создаём пространство для встреч, идей и событий, которые хочется запомнить.</p>
              <p>Будем рады стать частью вашего мероприятия.</p>
            </div>
            <div>
              <SectionCta href="#booking" label="Провести событие в ARKA 123" />
            </div>
          </div>
        </div>

        <div className="mt-20 lg:mt-28">
          <ReviewsSlider />
        </div>
      </div>
    </section>
  );
}
