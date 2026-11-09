import { PRICING_ROWS, HOW_IT_WORKS_STEPS } from '@/data/site';

const LABEL_ROW_CLASS = 'mb-6 border-b border-[#d8cfc6] pb-5';

export default function PricingSection() {
  return (
    <section id="pricing" className="border-b border-[#ded7cf] bg-[#F8F5F0] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 max-w-[760px] lg:mb-20">
          <p className="eyebrow section-eyebrow mb-6 text-[#81766C]">СТОИМОСТЬ И ПОДГОТОВКА</p>
          <h2 className="text-[clamp(2.1rem,3vw,3.5rem)] font-normal leading-[1.08] tracking-[-0.04em] text-[#242321]">
            От идеи до готового пространства
          </h2>
        </div>

        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className={LABEL_ROW_CLASS}>
              <p className="eyebrow text-[#81766C]">Этапы подготовки</p>
            </div>
            <ol className="grid">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <li
                  key={step.index}
                  className="grid grid-cols-[48px_1fr] gap-4 border-t border-[#d8cfc6] py-6 first:border-t-0 first:pt-0 last:border-b"
                >
                  <span className="pt-1 text-xs tabular-nums tracking-[0.12em] text-[#81766C]">{step.index}</span>
                  <div>
                    <h3 className="text-lg font-medium leading-snug text-[#242321]">{step.title}</h3>
                    <p className="mt-2 max-w-[460px] text-sm leading-[1.7] text-[#71685f]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className={LABEL_ROW_CLASS}>
              <p className="eyebrow text-[#81766C]">Стоимость</p>
            </div>
            <div className="flex items-baseline gap-3 text-[#242321]">
              <span className="text-[clamp(3rem,5vw,4.5rem)] font-normal leading-none tracking-[-0.055em]">130 BYN</span>
              <span className="text-base text-[#81766C]">/ час</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#71685f]">Минимальный срок аренды — 3 часа.</p>
            <table className="mt-8 w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-[#d8cfc6] text-[11px] uppercase tracking-[0.13em] text-[#81766C]">
                  <th scope="col" className="py-4 font-medium">Продолжительность</th>
                  <th scope="col" className="py-4 text-right font-medium">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_ROWS.map((row) => (
                  <tr key={row.duration} className="border-b border-[#d8cfc6]">
                    <td className="py-4 text-[15px] text-[#38332E]">{row.duration}</td>
                    <td className="py-4 text-right text-[15px] tabular-nums text-[#242321]">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-7 max-w-[560px] text-sm leading-[1.75] text-[#71685f]">
              Базовая стоимость включает пользование пространством, Wi-Fi и кофейной зоной. Дополнительная мебель,
              оборудование и специальная подготовка согласовываются индивидуально.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
