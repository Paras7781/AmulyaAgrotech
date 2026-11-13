import { useLanguage } from '../../i18n';
import { Container } from '../common/Container';

export function WhyAmulya() {
  const { t } = useLanguage();
  const benefits = [
    ['01', t('home.why.precision'), t('home.why.precisionText')],
    ['02', t('home.why.efficiency'), t('home.why.efficiencyText')],
    ['03', t('home.why.coverage'), t('home.why.coverageText')],
    ['04', t('home.why.time'), t('home.why.timeText')],
  ];

  return <section className="why-drones"><Container><div className="why-drones-head"><span className="eyebrow"><i/>{t('home.why.kicker')}</span><h2>{t('home.why.title')}<br/><em>{t('home.why.titleAccent')}</em></h2><p>{t('home.why.subtitle')}</p></div><div className="benefit-rail">{benefits.map(([number, title, text]) => <div key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></div>)}</div></Container></section>;
}
