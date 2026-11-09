import BrandStoryVideo from '@/components/BrandStoryVideo';
import {
  BRAND_STORY_MOBILE_POSTER_SRC,
  BRAND_STORY_MOBILE_VIDEO_SRC,
  BRAND_STORY_POSTER_SRC,
  BRAND_STORY_VIDEO_SRC,
} from '@/data/site';

export default function BrandStorySection() {
  return (
    <section
      id="brand-story"
      className="relative w-full overflow-hidden bg-ink-950"
    >
      <BrandStoryVideo
        src={BRAND_STORY_VIDEO_SRC}
        mobileSrc={BRAND_STORY_MOBILE_VIDEO_SRC}
        poster={BRAND_STORY_POSTER_SRC}
        mobilePoster={BRAND_STORY_MOBILE_POSTER_SRC}
      />
    </section>
  );
}
