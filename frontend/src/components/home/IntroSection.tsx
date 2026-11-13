import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { Container } from '../common/Container';
import { media } from '../../data/mockData';

export function IntroSection() {
  const { t } = useLanguage();
  const points = [
    { number: '01', title: t('home.intro.precision'), description: t('home.intro.precisionText') },
    { number: '02', title: t('home.intro.efficiency'), description: t('home.intro.efficiencyText') },
    { number: '03', title: t('home.intro.coverage'), description: t('home.intro.coverageText') },
  ];

  return (
    <section className="home-intro">
      <Container>
        <div className="intro-top">
          <div className="intro-copy">
            <span className="eyebrow dark"><i />{t('home.intro.eyebrow')}</span>
            <h2>{t('home.intro.title')}<br /><em>{t('home.intro.titleAccent')}</em></h2>
            <p>{t('home.intro.subtitle')}</p>
            <Link className="text-link intro-link" to="/about">
              {t('home.intro.discover')}
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="intro-statement">
            <span>{t('home.intro.statement')}</span>
            <h3>{t('home.intro.statementTitle')}<br /><em>{t('home.intro.statementTitleAccent')}</em></h3>
            <p>{t('home.intro.statementText')}</p>
          </div>
        </div>

        <div className="intro-visual">
          <div className="intro-image">
            <img src={media.field} alt={t('home.intro.visualKicker')} loading="lazy" />
            <div className="intro-image-overlay" aria-hidden="true" />
            <div className="intro-image-top">
              <span className="intro-image-index">01</span>
              <span className="intro-image-tag">{t('home.intro.visualTag')}</span>
            </div>

            <div className="intro-image-content">
              <span className="intro-image-kicker">{t('home.intro.visualKicker')}</span>
              <h3>{t('home.intro.visualTitle')}<br /><em>{t('home.intro.visualTitleAccent')}</em></h3>
              <p>{t('home.intro.visualText')}</p>
            </div>

            <div className="intro-image-bottom">
              <span>{t('home.intro.eyebrow')} / {t('home.intro.visualTag')}</span>
              <ArrowRight size={20} />
            </div>
          </div>
        </div>

        <div className="intro-points">
          {points.map((point) => (
            <div className="intro-point" key={point.number}>
              <span className="intro-number">{point.number}</span>
              <div className="intro-point-content"><h4>{point.title}</h4><p>{point.description}</p></div>
              <span className="intro-point-arrow" aria-hidden="true">→</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}