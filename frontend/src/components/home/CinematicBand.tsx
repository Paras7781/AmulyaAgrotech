import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { media } from '../../data/mockData';
import { useLanguage } from '../../i18n';

export function CinematicBand() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [bandOffset, setBandOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 768) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              const delta = (rect.top / window.innerHeight) * 24;
              setBandOffset(delta);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cinematic-band"
      style={{
        backgroundImage: `url(${media.field})`,
        backgroundPositionY: `calc(50% + ${bandOffset}px)`,
      }}
    >
      <div className="cinematic-shade" />
      <div>
        <span className="eyebrow">
          <i />
          {t('home.band.kicker')}
        </span>
        <h2>
          {t('home.band.title')}
          <br />
          <em>{t('home.band.titleAccent')}</em>
        </h2>
        <Link className="button gold" to="/about">
          {t('home.band.discover')} <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}
