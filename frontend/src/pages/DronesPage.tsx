import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';
import { getDrones } from '../data/mockData';

export function DronesPage() {
  const { language, t } = useLanguage();
  const drones = getDrones(language);
  const [active, setActive] = useState(0);
  const drone = drones[active];
  const next = () => setActive(index => (index + 1) % drones.length);

  return (
    <PublicPage heroKey="drones" kicker={t('drones.kicker')} title={<>{t('drones.title')}<br /><em>{t('drones.titleAccent')}</em></>}>
      <Container className="fleet-page">
        <div className="fleet-stage">
          <div className="fleet-image">
            <img key={drone.image} src={drone.image} alt={drone.name} />
            <span>0{active + 1} / 0{drones.length}</span>
          </div>
          <div className="fleet-copy">
            <span className="eyebrow dark"><i /> {drone.category}</span>
            <h2>{drone.name}</h2>
            <p>{drone.description}</p>
            <div className="spec-grid">
              {drone.specs.map(([label, value]) => (
                <div key={label}><span>{label}</span><b>{value}</b></div>
              ))}
            </div>
            <div className="feature-list">
              {drone.features.map(feature => <span key={feature}>{feature}</span>)}
            </div>
            <div className="fleet-actions">
              <Button className="gold" to={`/drones/${drone.id}`}>{t('common.viewDrone')} <ArrowUpRight size={17} /></Button>
              <button className="next-drone" onClick={next}>{t('common.nextDrone')} <ArrowRight size={17} /></button>
            </div>
          </div>
        </div>
        <div className="fleet-strip">
          {drones.map((item, index) => (
            <button className={index === active ? 'active' : ''} onClick={() => setActive(index)} key={item.id}>
              <b>0{index + 1}</b>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </Container>

      <section className="comparison-section">
        <Container>
          <div className="editorial-heading light">
            <span className="eyebrow"><i /> {t('drones.placeholder')}</span>
            <h2>{t('drones.compareTitle')}<br /><em>{t('drones.compareTitleAccent')}</em></h2>
          </div>
          <div className="comparison-table">
            <div className="comparison-row comparison-head">
              <span>{t('drones.specification')}</span>
              {drones.map(item => <b key={item.id}>{item.name}</b>)}
            </div>
            {[t('drones.compareLabels.capacity'), t('drones.compareLabels.coverage'), t('drones.compareLabels.flightTime'), t('drones.compareLabels.battery')].map(label => (
              <div className="comparison-row" key={label}>
                <span>{label}</span>
                {drones.map(item => (
                  <b key={item.id}>{item.specs.find(spec => spec[0] === label)?.[1] ?? t('drones.placeholderSpec')}</b>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="catalogue-cta">
        <span className="eyebrow dark"><i /> {t('drones.findFit')}</span>
        <h2>{t('drones.beforeNext')}<br /><em>{t('drones.beforeNextAccent')}</em></h2>
        <Button className="gold" to="/quotation">{t('common.getQuotation')} <ArrowUpRight size={17} /></Button>
      </section>
    </PublicPage>
  );
}
