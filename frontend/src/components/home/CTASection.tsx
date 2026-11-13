import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';

export function CTASection() {
  const { t } = useLanguage();
  return <section className="cta-section"><div className="eyebrow"><span/>{t('home.cta.kicker')}</div><h2>{t('home.cta.title')}<br/><em>{t('home.cta.titleAccent')}</em></h2><div className="cta-actions"><Link className="button gold" to="/quotation">{t('common.getQuotation')} <ArrowUpRight size={17}/></Link><a className="button outline-light" href="tel:7972908815">{t('common.callUs')} <ArrowUpRight size={17}/></a></div></section>;
}
