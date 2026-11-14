import { Check, ChevronDown, FileText, HelpCircle } from 'lucide-react';
import { useLanguage } from '../i18n';
import { faqAnswers } from '../i18n/translations';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';

export function SubsidyPage() {
  const { language, t } = useLanguage();
  const process = t('subsidyPage.process.steps').split('|');
  const documents = t('subsidyPage.documents.list').split('|');
  const faqQuestions = t('subsidyPage.faqQuestions').split('|');

  return (
    <PublicPage
      heroKey="subsidy"
      kicker={t('subsidyPage.kicker')}
      title={<>{t('subsidyPage.title')}<br /><em>{t('subsidyPage.titleAccent')}</em></>}
    >
      <Container className="guidance-page">
        <div className="guidance-lead">
          <div>
            <span className="eyebrow dark"><i /> {t('subsidyPage.lead.eyebrow')}</span>
            <h2>{t('subsidyPage.lead.title')}<br /><em>{t('subsidyPage.lead.titleAccent')}</em></h2>
          </div>
          <p>{t('subsidyPage.lead.text')}</p>
        </div>
        <div className="eligibility-grid">
          <div><HelpCircle /><h3>{t('subsidyPage.eligibility.title')}</h3><p>{t('subsidyPage.eligibility.text')}</p></div>
          <div><FileText /><h3>{t('subsidyPage.prepare.title')}</h3><p>{t('subsidyPage.prepare.text')}</p></div>
        </div>
      </Container>
      <section className="process-section">
        <Container>
          <div className="editorial-heading light">
            <span className="eyebrow"><i /> {t('subsidyPage.process.eyebrow')}</span>
            <h2>{t('subsidyPage.process.title')}<br /><em>{t('subsidyPage.process.titleAccent')}</em></h2>
          </div>
          <ol className="process-line">
            {process.map((item, index) => <li key={item}><b>0{index + 1}</b><span>{item}</span><Check size={17} /></li>)}
          </ol>
        </Container>
      </section>
      <Container className="documents-section">
        <div>
          <span className="eyebrow dark"><i /> {t('subsidyPage.documents.eyebrow')}</span>
          <h2>{t('subsidyPage.documents.title')}<br /><em>{t('subsidyPage.documents.titleAccent')}</em></h2>
        </div>
        <ul>{documents.map(document => <li key={document}><Check size={17} />{document}<small>{t('common.required')}</small></li>)}</ul>
      </Container>
      <section className="disclaimer-section">
        <Container><strong>{t('subsidyPage.important')}</strong><p>{t('subsidyPage.disclaimer')}</p></Container>
      </section>
      <Container className="faq-section">
        <div className="editorial-heading">
          <span className="eyebrow dark"><i /> {t('subsidyPage.faq.eyebrow')}</span>
          <h2>{t('subsidyPage.faq.title')}<br /><em>{t('subsidyPage.faq.titleAccent')}</em></h2>
        </div>
        <div className="faq-stack">
          {faqQuestions.map((question, index) => (
            <details key={question}>
              <summary>{question}<ChevronDown size={18} /></summary>
              <p>{faqAnswers[language].subsidy[index]}</p>
            </details>
          ))}
        </div>
      </Container>
    </PublicPage>
  );
}
