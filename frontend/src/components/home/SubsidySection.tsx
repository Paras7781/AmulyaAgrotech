import { ArrowUpRight, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';

export function SubsidySection() {
  const { t } = useLanguage();

  return <section className="subsidy-feature"><div><div className="eyebrow"><span/>{t('home.subsidy.kicker')}</div><h2>{t('home.subsidy.title')}<br/><em>{t('home.subsidy.titleAccent')}</em></h2><p>{t('home.subsidy.subtitle')}</p><Link className="button gold" to="/subsidy">{t('home.subsidy.document')} <ArrowUpRight size={17}/></Link></div><div className="subsidy-points"><div><FileText/><span>01</span><b>{t('home.subsidy.document')}</b></div><div><ShieldCheck/><span>02</span><b>{t('home.subsidy.eligibility')}</b></div></div></section>;
}
