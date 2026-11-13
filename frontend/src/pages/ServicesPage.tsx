import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';
import { ProcessTimeline } from '../components/home/ProcessTimeline';
import { getServices } from '../data/mockData';

export function ServicesPage() {
  const { language, t } = useLanguage();
  const services = getServices(language);
  const journey = t('servicesPage.journey.steps').split('|');

  return <PublicPage heroKey="services" kicker={t('servicesPage.kicker')} title={<>{t('servicesPage.title')}<br/><em>{t('servicesPage.titleAccent')}</em></>}><section className="service-journey"><div className="journey-intro"><span className="eyebrow"><i/> {t('servicesPage.journey.kicker')}</span><h2>{t('servicesPage.journey.title')}<br/><em>{t('servicesPage.journey.titleAccent')}</em></h2></div><div className="journey-steps">{journey.map((title, index) => <div key={title}><b>{`0${index + 1}`}</b><span>{title}</span>{index < journey.length - 1 && <ArrowDown size={16}/>}</div>)}</div></section><Container className="service-story"><div className="editorial-heading"><span className="eyebrow dark"><i/> {t('servicesPage.detail.eyebrow')}</span><h2>{t('servicesPage.detail.title')}<br/><em>{t('servicesPage.detail.titleAccent')}</em></h2></div>{services.map((service, index) => <article className="service-feature" key={service.title}><img loading="lazy" src={service.image} alt={service.title}/><div><span className="service-number">0{index + 1}</span><h3>{service.title}</h3><p>{service.text} {t('servicesPage.finalDetails')}</p><a href="/contact">{t('servicesPage.discuss')} <ArrowUpRight size={17}/></a></div></article>)}</Container><ProcessTimeline/><section className="services-cta"><span className="eyebrow"><i/> {t('servicesPage.cta.eyebrow')}</span><h2>{t('servicesPage.cta.title')}<br/><em>{t('servicesPage.cta.titleAccent')}</em></h2><a className="button gold" href="/contact">{t('common.contactUs')} <ArrowUpRight size={17}/></a></section></PublicPage>;
}
