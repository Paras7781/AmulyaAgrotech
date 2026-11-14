import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n';
import { faqAnswers } from '../i18n/translations';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';
import { getDrones, media } from '../data/mockData';

export function DroneDetailPage() {
  const { language, t } = useLanguage();
  const drones = getDrones(language);
  const { id } = useParams();
  const drone = drones.find(item => item.id === Number(id));
  const [activeImage, setActiveImage] = useState(drone?.image ?? media.drone);

  if (!drone) {
    return <PublicPage kicker={t('drones.notFoundTitle')} title={t('drones.notFoundText')}><Container className="empty-state"><p>{t('drones.notFoundText')}</p><Button className="gold" to="/drones">{t('common.viewFullFleet')}</Button></Container></PublicPage>;
  }

  const images = [drone.image, media.field];
  const faqQuestions = t('drones.faqQuestions').split('|');

  return (
    <PublicPage kicker={`DRONE 0${drone.id} / ${drone.name}`} title={t('drones.designed')} image={drone.image}>
      <Container className="product-detail">
        <div className="product-gallery">
          <div className="product-main-image"><img src={activeImage} alt={drone.name} /></div>
          <div className="product-thumbs">
            {images.map(image => (
              <button className={activeImage === image ? 'active' : ''} onClick={() => setActiveImage(image)} key={image}>
                <img loading="lazy" src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="product-detail-copy">
          <span className="eyebrow dark"><i /> {drone.tag}</span>
          <h2>{drone.name}</h2>
          <p>{drone.description}</p>
          <div className="product-detail-actions">
            <Button className="gold" to="/quotation">{t('common.getQuotation')}</Button>
            <Button className="outline-dark" to="/contact">{t('common.contactUs')}</Button>
          </div>
          <div className="spec-grid">
            {drone.specs.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}
          </div>
        </div>
      </Container>
      <section className="detail-features-band">
        <Container>
          <div className="editorial-heading light">
            <span className="eyebrow"><i /> {t('drones.productProfile')}</span>
            <h2>{t('drones.designed')}<br /><em>{t('drones.designedAccent')}</em></h2>
          </div>
          <div className="feature-columns">
            <div>
              <h3>{t('drones.features')}</h3>
              <ul>{drone.features.map(feature => <li key={feature}><Check size={17} />{feature}</li>)}</ul>
            </div>
            <div>
              <h3>{t('drones.included')}</h3>
              <ul>{drone.included.map(item => <li key={item}><ArrowUpRight size={17} />{item}</li>)}</ul>
            </div>
            <div>
              <h3>{t('drones.warranty')}</h3>
              <p>{drone.warranty}</p>
              <p>{t('drones.placeholderSpec')}</p>
            </div>
          </div>
        </Container>
      </section>
      <Container className="detail-faq">
        <div className="editorial-heading">
          <span className="eyebrow dark"><i /> {t('drones.faq')}</span>
          <h2>{t('drones.beforeNext')}<br /><em>{t('drones.beforeNextAccent')}</em></h2>
        </div>
        <div>
          {faqQuestions.map((question, index) => (
            <details key={question}>
              <summary>{question}<ChevronDown size={18} /></summary>
              <p>{faqAnswers[language].drones[index]}</p>
            </details>
          ))}
        </div>
      </Container>
    </PublicPage>
  );
}
