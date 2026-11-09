import { ArrowRight } from 'lucide-react';

type SectionCtaProps = {
  href: string;
  label: string;
};

export default function SectionCta({ href, label }: SectionCtaProps) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-6 bg-brand px-6 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-ink-900"
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
    </a>
  );
}
