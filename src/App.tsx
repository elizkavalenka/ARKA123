import SiteHeader from '@/components/SiteHeader';
import SitePreloader from '@/components/SitePreloader'; 
import HeroSection from '@/components/HeroSection';
import BrandStorySection from '@/components/BrandStorySection';
import AboutSection from '@/components/AboutSection';
import ArchitectureSection from '@/components/ArchitectureSection';
import ScenariosSection from '@/components/ScenariosSection';
import FacilitiesSection from '@/components/FacilitiesSection';
import PricingSection from '@/components/PricingSection';
import ReviewsSection from '@/components/ReviewsSection';
import BookingSection from '@/components/BookingSection';
import SiteFooter from '@/components/SiteFooter';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';

function MainSite() {
  return (
    <>
      <SitePreloader />
      <a
        href="#booking"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-white focus:px-4 focus:py-3 focus:text-ink-900"
      >
        Перейти к бронированию
      </a>
      <SiteHeader />
      <main className="section-numbering [overflow-x:clip]">
        <HeroSection/>
        <AboutSection />
        <BrandStorySection />
        <ArchitectureSection />
        <FacilitiesSection />
        <ScenariosSection />
        <ReviewsSection />
        <PricingSection />
        <BookingSection />
      </main>
      <SiteFooter />
    </>
  );
}

export default function App() {
  return window.location.pathname === '/privacy' ? <PrivacyPolicyPage /> : <MainSite />;
}
