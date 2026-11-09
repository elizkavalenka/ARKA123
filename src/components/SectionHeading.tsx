type SectionHeadingProps = {
  label: string;
  title: string;
};

export default function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <div>
      <p className="eyebrow section-eyebrow mb-5 text-brand">{label}</p>
      <h2 className="text-[30px] font-medium leading-[1.1] tracking-[-0.01em] sm:text-[36px] lg:text-[48px]">
        {title}
      </h2>
    </div>
  );
}
