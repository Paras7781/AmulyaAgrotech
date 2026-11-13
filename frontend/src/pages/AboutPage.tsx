import { Check, Eye, Target } from 'lucide-react';
import { useLanguage } from '../i18n';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';
import { media } from '../data/mockData';

export function AboutPage() {
  const { t } = useLanguage();
  const values = t('about.values.list').split('|');
  const capabilities = [
    ['01', t('about.capabilities.card1.title'), t('about.capabilities.card1.text')],
    ['02', t('about.capabilities.card2.title'), t('about.capabilities.card2.text')],
    ['03', t('about.capabilities.card3.title'), t('about.capabilities.card3.text')],
  ];

  return (
    <PublicPage heroKey="about" kicker={t('about.kicker')} title={<>{t('about.title')}<br /><em>{t('about.titleAccent')}</em></>}>
      <section className="story-layout">
        <div className="story-copy">
          <span className="eyebrow dark"><i /> {t('about.story.eyebrow')}</span>
          <h2>{t('about.story.title')}<br /><em>{t('about.story.titleAccent')}</em></h2>
          <p>{t('about.story.intro')}</p>
          <p className="placeholder-note">{t('about.story.placeholder')}</p>
        </div>
        <img loading="lazy" src={media.field} alt={t('about.images.field')} />
      </section>

      <section className="mission-vision">
        <div className="mission-card">
          <Target />
          <span>{t('about.mission.label')}</span>
          <h2>{t('about.mission.title')}</h2>
          <p>{t('about.mission.text')}</p>
        </div>
        <div className="vision-card">
          <Eye />
          <span>{t('about.vision.label')}</span>
          <h2>{t('about.vision.title')}</h2>
          <p>{t('about.vision.text')}</p>
        </div>
      </section>

      <Container className="values-section">
        <div className="editorial-heading">
          <span className="eyebrow dark"><i /> {t('about.values.eyebrow')}</span>
          <h2>{t('about.values.title')}<br /><em>{t('about.values.titleAccent')}</em></h2>
        </div>
        <div className="values-list">
          {values.map(value => <div key={value}><Check size={18} /><span>{value}</span></div>)}
        </div>
      </Container>

      <section className="technology-split">
        <img loading="lazy" src={media.drone} alt={t('about.images.drone')} />
        <div>
          <span className="eyebrow"><i /> {t('about.approach.eyebrow')}</span>
          <h2>{t('about.approach.title')}<br /><em>{t('about.approach.titleAccent')}</em></h2>
          <p>{t('about.approach.text')}</p>
          <Button className="gold" to="/drones">{t('about.explore')}</Button>
        </div>
      </section>

      <Container className="capabilities-section">
        <div className="editorial-heading">
          <span className="eyebrow dark"><i /> {t('about.capabilities.eyebrow')}</span>
          <h2>{t('about.capabilities.title')}<br /><em>{t('about.capabilities.titleAccent')}</em></h2>
        </div>
        <div className="capabilities-grid">
          {capabilities.map(([number, title, text]) => <div key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </Container>
    </PublicPage>
  );
}
