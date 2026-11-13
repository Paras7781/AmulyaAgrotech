import { useEffect } from 'react';
import { InfiniteMarquee } from '../components/common/InfiniteMarquee';
import { CTASection } from '../components/home/CTASection';
import { CinematicBand } from '../components/home/CinematicBand';
import { DroneShowcase } from '../components/home/DroneShowcase';
import { FeatureStrip } from '../components/home/FeatureStrip';
import { GalleryPreview } from '../components/home/GalleryPreview';
import { Hero } from '../components/home/Hero';
import { InteractiveFarm } from '../components/home/InteractiveFarm';
import { IntroSection } from '../components/home/IntroSection';
import { ProcessTimeline } from '../components/home/ProcessTimeline';
import { ServicesSection } from '../components/home/ServicesSection';
import { SubsidySection } from '../components/home/SubsidySection';
import { WhyAmulya } from '../components/home/WhyAmulya';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

export function HomePage() {
  useEffect(() => {
    document.title = 'Amulya Agrotech | Agricultural Drone Technology & Precision Farming';
  }, []);

  return (
    <>
      <Navbar />
      <main id="main-content">
      <div data-reveal className="reveal-on-scroll">
        <Hero />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <FeatureStrip />
      </div>
      <InfiniteMarquee variant="dark" speed={38} />
      <div data-reveal className="reveal-on-scroll">
        <InteractiveFarm />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <IntroSection />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <DroneShowcase />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <WhyAmulya />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <ServicesSection />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <ProcessTimeline />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <SubsidySection />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <CinematicBand />
      </div>
      <div data-reveal className="reveal-on-scroll">
        <GalleryPreview />
      </div>
      <InfiniteMarquee variant="gold" reverse speed={42} />
      <div data-reveal className="reveal-on-scroll">
        <CTASection />
      </div>
      </main>
      <Footer />
    </>
  );
}
