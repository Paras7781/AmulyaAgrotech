import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../i18n';
import type { Language } from '../../i18n/translations';
import { Button } from '../common/Button';
import { LazyDrone3DCanvas } from './LazyDrone3DCanvas';

const heroCopy: Record<Language, {
  headline: string;
  headlineAccent: string;
  description: string;
  solutions: string;
  demo: string;
  callouts: [string, string, string];
}> = {
  en: {
    headline: 'The future of',
    headlineAccent: 'farming is here.',
    description: 'Smarter agriculture powered by precision drone technology.',
    solutions: 'Explore Our Solutions',
    demo: 'Book a Drone Demo',
    callouts: ['Precision Agriculture', 'Smart Crop Monitoring', 'Advanced Drone Technology'],
  },
  hi: {
    headline: 'खेती का भविष्य',
    headlineAccent: 'यहीं है।',
    description: 'प्रिसिजन ड्रोन तकनीक से संचालित स्मार्ट कृषि।',
    solutions: 'हमारे समाधान देखें',
    demo: 'ड्रोन डेमो बुक करें',
    callouts: ['प्रिसिजन एग्रीकल्चर', 'स्मार्ट फसल निगरानी', 'उन्नत ड्रोन तकनीक'],
  },
  mr: {
    headline: 'शेतीचे भविष्य',
    headlineAccent: 'इथेच आहे.',
    description: 'प्रिसिजन ड्रोन तंत्रज्ञानावर आधारित स्मार्ट शेती.',
    solutions: 'आमची समाधानं पहा',
    demo: 'ड्रोन डेमो बुक करा',
    callouts: ['प्रिसिजन ॲग्रीकल्चर', 'स्मार्ट पीक निरीक्षण', 'प्रगत ड्रोन तंत्रज्ञान'],
  },
};

export function Hero() {
  const { language, t } = useLanguage();
  const copy = heroCopy[language];

  return (
    <section className="hero">
      <div className="hero-shade" />

      <div className="hero-grid-container">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="subtle-float" />
            {t('home.hero.kicker')}
          </div>

          <h1>
            {copy.headline}
            <br />
            <em>{copy.headlineAccent}</em>
          </h1>

          <p>{copy.description}</p>

          <div className="hero-actions">
            <Button className="gold" to="/services">
              {copy.solutions}
              <ArrowRight size={17} />
            </Button>

            <Button className="ghost" to="/contact">
              {copy.demo}
              <ArrowUpRight size={17} />
            </Button>
          </div>
        </div>

        <div className="hero-3d-stage">
          <div className="hero-3d-model-wrap">
            <LazyDrone3DCanvas variant="hero" autoRotate={false} interactive showSpray={false} />
          </div>
          <div className="hero-callouts" aria-label="Agricultural drone technology">
            {copy.callouts.map((callout) => <span key={callout}>{callout}</span>)}
          </div>
        </div>
      </div>

      <a className="scroll-cue" href="#drones" aria-label={t('common.scrollExplore')}>
        <span>{t('home.hero.scroll')}</span>
        <ArrowDown size={16} className="subtle-float" />
      </a>
    </section>
  );
}

export default Hero;
