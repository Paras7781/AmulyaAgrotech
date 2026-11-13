import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { BackToTop } from './components/common/BackToTop';
import { ScrollProgress } from './components/common/ScrollProgress';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DroneDetailPage } from './pages/DroneDetailPage';
import { DronesPage } from './pages/DronesPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { QuotationPage } from './pages/QuotationPage';
import { ServicesPage } from './pages/ServicesPage';
import { SubsidyPage } from './pages/SubsidyPage';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Reset scroll position on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Staggered scroll reveal initialization
    const revealItems = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <>
      <ScrollProgress />
      <div className="page-transition-wrapper" key={location.pathname}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/drones" element={<DronesPage />} />
          <Route path="/drones/:id" element={<DroneDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/subsidy" element={<SubsidyPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/quotation" element={<QuotationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <BackToTop />
    </>
  );
}
