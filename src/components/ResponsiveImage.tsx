import type { ImgHTMLAttributes } from 'react';

type ResponsiveImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Full-size WebP source, e.g. "/images/foo.webp". */
  src: string;
  /** `sizes` hint for the browser's responsive selection. */
  sizes?: string;
  /**
   * Optional non-WebP fallback (e.g. a PNG) for the <1% of browsers without
   * WebP support. When provided, the WebP variants are served through a
   * <source> element and the <img> falls back to this file.
   */
  fallbackSrc?: string;
};

/**
 * Renders a responsive <img>/<picture> that lets the browser pick between a
 * 840px-wide and a full-width WebP depending on the layout and device pixel
 * ratio. WebP is supported by ~97% of browsers (Chrome, Edge, Firefox,
 * Safari 14+/iOS 14+, modern Android); the optional `fallbackSrc` covers the
 * rest.
 */
export default function ResponsiveImage({
  src,
  sizes,
  fallbackSrc,
  alt = '',
  ...rest
}: ResponsiveImageProps) {
  const smallSrc = src.replace(/\.webp$/, '-840.webp');
  const webpSrcSet = `${smallSrc} 840w, ${src} 1680w`;

  if (fallbackSrc) {
    return (
      <picture>
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
        <img src={fallbackSrc} sizes={sizes} alt={alt} {...rest} />
      </picture>
    );
  }

  return <img src={src} srcSet={webpSrcSet} sizes={sizes} alt={alt} {...rest} />;
}
