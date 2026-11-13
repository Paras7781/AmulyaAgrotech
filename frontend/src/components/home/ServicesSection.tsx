import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { getServices } from '../../data/mockData';
import { Container } from '../common/Container';

export function ServicesSection() {
  const { language, t } = useLanguage();
  const [active, setActive] = useState(0);
  const services = getServices(language);
  const service = services[active % services.length];

  return (
    <section className="interactive-services">
      <Container>
        <div className="services-intro">
          <div>
            <span className="eyebrow dark"><i/> {t('home.services.kicker')}</span>
            <h2>{t('home.services.title')}<br/><em>{t('home.services.titleAccent')}</em></h2>
          </div>
          <p>{t('home.services.subtitle')}</p>
        </div>
        <div className="service-interactive">
          <div className="service-visual">
            <img key={service.image} src={service.image} alt={service.title} />
            <span>0{active + 1} / 0{services.length}</span>
          </div>
          <div className="service-list-interactive">
            {services.map((item, index) => (
              <button className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onClick={() => setActive(index)} key={item.title}><span>0{index + 1}</span><b>{item.title}</b><ArrowUpRight size={17} /></button>
            ))}
          </div>
          <div className="service-active-copy">
            <span className="eyebrow dark"><i/> {t('home.services.selected')}</span>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <Link className="text-link" to="/services">{t('common.learnMore')} <ArrowUpRight size={17} /></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
