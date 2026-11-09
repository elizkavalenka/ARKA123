
import {
  LOGO_SRC,
  LOGO_TABLET_SRC,
  LOGO_MOBILE_SRC,
} from '@/data/site';

interface HoverFillLogoProps {
  className?: string;
}

export default function HoverFillLogo({
  className = '',
}: HoverFillLogoProps) {
  return (
    <span
      className={`inline-block ${className}`}
      aria-label="АРКА 123"
    >
      {/* DESKTOP: full logo with circular opacity reveal */}
      <span className="group relative hidden lg:block">
        {/* Full white logo */}
        <img
          src={LOGO_SRC}
          alt="АРКА 123"
          draggable={false}
          className="
            block
            h-auto
            w-full
            object-contain
          "
        />

        {/* Circular reveal animation */}
        <img
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="
            pointer-events-none
            absolute inset-0
            h-full w-full
            object-contain
            [clip-path:circle(150%_at_100%_0%)]
            transition-[clip-path]
            duration-700
            ease-out
            group-hover:[clip-path:circle(0%_at_100%_0%)]
            group-focus-within:[clip-path:circle(0%_at_100%_0%)]
            motion-reduce:transition-none
          "
        />
      </span>

      {/* TABLET: compact white symbol */}
      <img
        src={LOGO_TABLET_SRC}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="
          hidden sm:block lg:hidden
          h-auto w-full
          object-contain
        "
      />

      {/* MOBILE: horizontal white logo, centered */}
      <img
        src={LOGO_MOBILE_SRC}
        alt="АРКА 123"
        draggable={false}
        className="
          block sm:hidden
          h-auto
          mx-auto
          object-contain
        "
      />
    </span>
  );
}
