import EnquiryForm from '@/components/EnquiryForm';
import SectionHeading from '@/components/SectionHeading';

export default function BookingSection() {
  return (
    <section id="booking" className="bg-stone-100 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeading label="Бронирование" title="Забронировать пространство" />
          <p className="text-lg leading-[1.6] text-stone-700">
            Расскажите о своём мероприятии — мы свяжемся с вами и обсудим детали.
          </p>
          <p className="text-sm font-medium text-charcoal">Ответим в течение рабочего дня.</p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
