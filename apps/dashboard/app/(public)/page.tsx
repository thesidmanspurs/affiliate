import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PartnerStackHero } from '@/components/partnerstack-hero';
import { InteractivePlatformTour } from '@/components/interactive-platform-tour';
import { PartnerStackFeatureTabs } from '@/components/partnerstack-feature-tabs';
import { ConnectEarnGrow } from '@/components/connect-earn-grow';
import { TestimonialsMarquee } from '@/components/testimonials-marquee';
import { PartnerStackFAQSection } from '@/components/partnerstack-faq-section';

export default function HomePage() {
  return (
    <div className="relative bg-transparent text-[#09090B]">
      
      {/* 1. Hero Section (PartnerStack Style with Innotek Mascot Illustration) */}
      <PartnerStackHero />

      {/* 2. Live Interactive Platform Auto-Tour (Simulated Mouse Testing Features) */}
      <InteractivePlatformTour />

      {/* 3. PartnerStack 5-Second Auto-Advancing Feature Tabs with Themed Mockups */}
      <PartnerStackFeatureTabs />

      {/* 4. PartnerStack-Style "Testimonials across the web" (2-Row Continuous Smooth Marquee) */}
      <TestimonialsMarquee />

      {/* 5. Frequently Asked Questions (Accordion) */}
      <PartnerStackFAQSection />

      {/* 6. Connect. Earn. Grow. (2-Column Cards + Panoramic Partner Collage at the end) */}
      <ConnectEarnGrow />

    </div>
  );
}



