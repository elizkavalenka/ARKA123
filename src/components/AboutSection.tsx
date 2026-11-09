import ResponsiveImage from '@/components/ResponsiveImage';
import { ABOUT_IMAGE_SRC } from '@/data/site';

export default function AboutSection() {
  return (
    <section id="space" className="relative isolate overflow-hidden border-b border-[#ded7cf] bg-[#F3EEE8] py-20 sm:py-24 lg:min-h-[760px] lg:py-28">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-12">
        <div className="relative z-10 flex min-h-[420px] flex-col justify-center pb-16 lg:min-h-[500px] lg:pb-20">
          <p className="eyebrow section-eyebrow relative z-10 mb-7 text-[#81766C]">ПРОСТРАНСТВО</p>
          <h2 className="relative z-10 max-w-[590px] text-[clamp(2.2rem,3.4vw,4rem)] font-normal leading-[1.08] tracking-[-0.045em] text-[#242321]">Камерное пространство для больших идей</h2>
          <p className="relative z-10 mt-7 max-w-[470px] text-[15px] leading-[1.75] text-[#655e57]">АРКА 123 — архитектурное event-пространство площадью 123 м² для лекций, мастер-классов, презентаций и частных событий. Свет, арочные окна и гибкая организация зала создают основу для встреч и живого общения.</p>
          <a href="#architecture" className="relative z-10 mt-8 inline-flex w-fit items-center gap-3 border-b border-[#81766C] pb-2 text-sm text-[#38332E] transition-colors hover:border-[#203642] hover:text-[#203642]">Исследовать пространство <span aria-hidden>↗</span></a>
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-6 z-20 select-none whitespace-nowrap text-[clamp(14rem,40vw,38rem)] font-semibold leading-[0.72] tracking-[-0.06em] text-[#B7A99B]/[0.22]">123</span>
        </div>
        <figure className="relative z-0 -mx-5 sm:-mx-8 lg:mx-0 lg:mt-20">
          <ResponsiveImage src={ABOUT_IMAGE_SRC} alt="Светлый интерьер АРКА 123 с арочными окнами" sizes="(min-width: 1024px) 60vw, 100vw" loading="lazy" className="block aspect-[4/5] h-full max-h-[720px] w-full object-cover object-[50%_52%] lg:aspect-[5/6]" />
        </figure>
      </div>
    </section>
  );
}
