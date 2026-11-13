import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../i18n';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';
import { getDrones } from '../data/mockData';
import { apiUrl, isValidIndianMobile, submitQuotationForm } from '../api/client';

type QuotationForm = { need: string; drone: string; landArea: string; crop: string; timeline: string; name: string; phone: string; email: string; location: string; message: string };

export function QuotationPage() {
  const { language, t } = useLanguage();
  const drones = getDrones(language);
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState('');
  const [refNo, setRefNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const steps = t('quotation.wizard.steps').split('|');
  const needs = t('quotation.wizard.needs').split('|');
  const [form, setForm] = useState<QuotationForm>({ need: needs[0], drone: drones[0]?.name || '', landArea: '', crop: '', timeline: '', name: '', phone: '', email: '', location: '', message: '' });

  const update = (key: keyof QuotationForm, value: string) => setForm(current => ({ ...current, [key]: value }));

  const validateStep = () => {
    if (step === 0 && !form.need.trim()) return 'Please choose the type of assistance you need.';
    if (step === 1 && !form.drone.trim()) return 'Please select a drone model.';
    if (step === 2) {
      if (!form.landArea.trim()) return 'Please enter your land area.';
      if (!form.crop.trim()) return 'Please tell us which crop you are growing.';
    }
    if (step === 3) {
      if (!form.name.trim()) return 'Please enter your name.';
      if (!isValidIndianMobile(form.phone)) return 'Please enter a valid 10-digit Indian mobile number.';
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address.';
      if (!form.location.trim()) return 'Please enter your location.';
    }
    return '';
  };

  const next = () => {
    const validationError = validateStep();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setNotice('');
    setErrorMsg('');
    setStep(current => Math.min(4, current + 1));
  };
  const back = () => { setNotice(''); setErrorMsg(''); setStep(current => Math.max(0, current - 1)); };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (step < 4) {
      next();
      return;
    }

    const validationError = validateStep();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await submitQuotationForm({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        message: form.message.trim(),
        landArea: form.landArea.trim(),
        crop: form.crop.trim(),
        timeline: form.timeline.trim(),
        language,
      });
      setRefNo(res.reference_number);
      setNotice(
        res.message.includes('could not be delivered')
          ? res.message
          : t('quotation.wizard.success')
      );
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit quotation request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicPage heroKey="quotation" kicker={t('quotation.kicker')} title={<>{t('quotation.title')}<br/><em>{t('quotation.titleAccent')}</em></>}>
      <Container className="quotation-tool">
        <div className="wizard-header">
          <span className="eyebrow dark"><i/> {t('quotation.wizard.eyebrow')}</span>
          <h2>{t('quotation.wizard.title')}<br/><em>{t('quotation.wizard.titleAccent')}</em></h2>
          <p>{t('quotation.wizard.intro')}</p>
        </div>
        <div className="wizard-progress">
          {steps.map((label, index) => <div className={index <= step ? 'active' : ''} key={label}><b>0{index + 1}</b><span>{label}</span></div>)}
        </div>
        <form className="wizard-form" onSubmit={handleSubmit}>
          {step === 0 && (
            <fieldset className="choice-screen">
              <legend>{t('quotation.wizard.question')}</legend>
              <p>{t('quotation.wizard.questionText')}</p>
              {needs.map(option => (
                <label key={option}>
                  <input type="radio" name="need" checked={form.need === option} onChange={() => update('need', option)}/>
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          )}

          {step === 1 && (
            <div className="wizard-screen">
              <label>{t('quotation.wizard.selectDrone')}
                <select value={form.drone} onChange={event => update('drone', event.target.value)}>
                  {drones.map(drone => <option key={drone.id} value={drone.name}>{drone.name}</option>)}
                </select>
              </label>
              <p className="mock-helper">{t('quotation.wizard.helper')}</p>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-screen">
              <div className="wizard-section-label">{t('quotation.wizard.requirements')}</div>
              <div className="form-grid">
                <label>{t('quotation.wizard.landArea')}
                  <input required maxLength={120} value={form.landArea} onChange={event => update('landArea', event.target.value)} placeholder={t('quotation.wizard.landAreaPlaceholder')}/>
                </label>
                <label>{t('quotation.wizard.crop')}
                  <input required maxLength={120} value={form.crop} onChange={event => update('crop', event.target.value)} placeholder={t('quotation.wizard.cropPlaceholder')}/>
                </label>
                <label>{t('quotation.wizard.timeline')}
                  <input maxLength={120} value={form.timeline} onChange={event => update('timeline', event.target.value)} placeholder={t('quotation.wizard.timeline')}/>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-screen">
              <div className="wizard-section-label">{t('quotation.wizard.requirements')}</div>
              <div className="form-grid">
                <label>{t('quotation.wizard.name')}
                  <input required maxLength={120} autoComplete="name" value={form.name} onChange={event => update('name', event.target.value)} placeholder={t('quotation.wizard.namePlaceholder')}/>
                </label>
                <label>{t('quotation.wizard.phone')}
                  <input required type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={form.phone} onChange={event => update('phone', event.target.value)} placeholder={t('quotation.wizard.phonePlaceholder')}/>
                </label>
                <label>{t('quotation.wizard.email')}
                  <input required type="email" autoComplete="email" maxLength={180} value={form.email} onChange={event => update('email', event.target.value)} placeholder={t('quotation.wizard.emailPlaceholder')}/>
                </label>
                <label>{t('quotation.wizard.location')}
                  <input required maxLength={180} autoComplete="address-level2" value={form.location} onChange={event => update('location', event.target.value)} placeholder={t('quotation.wizard.locationPlaceholder')}/>
                </label>
                <label className="full-width">{t('quotation.wizard.notes')}
                  <textarea maxLength={2000} value={form.message} onChange={event => update('message', event.target.value)} rows={5} placeholder={t('quotation.wizard.notesPlaceholder')}/>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="wizard-screen review-screen">
              <div className="wizard-section-label">{t('quotation.wizard.summaryTitle')}</div>
              <p>{t('quotation.wizard.summaryText')}</p>
              <div className="summary-list">
                <div><span>{t('quotation.wizard.question')}</span><b>{form.need}</b></div>
                <div><span>{t('quotation.wizard.selectDrone')}</span><b>{form.drone}</b></div>
                <div><span>{t('quotation.wizard.landArea')}</span><b>{form.landArea}</b></div>
                <div><span>{t('quotation.wizard.crop')}</span><b>{form.crop}</b></div>
                <div><span>{t('quotation.wizard.timeline')}</span><b>{form.timeline}</b></div>
                <div><span>{t('quotation.wizard.location')}</span><b>{form.location}</b></div>
                {refNo && <div><span>Quotation Reference:</span><b style={{ color: '#c5a059', letterSpacing: '0.05em' }}>{refNo}</b></div>}
              </div>
            </div>
          )}

          {errorMsg && <div className="form-error" role="alert" style={{ color: '#e53935', marginTop: '1rem' }}>{errorMsg}</div>}
          
          {notice && (
            <div className="wizard-notice" role="status" aria-live="polite">
              <Check size={18}/>
              <div>
                <span>{notice}</span>
                {refNo && (
                  <div style={{ marginTop: '0.4rem', fontWeight: 600 }}>
                    <div>Reference ID: <span style={{ color: 'var(--gold, #f2c230)', letterSpacing: '0.04em' }}>{refNo}</span></div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <a
                        href={apiUrl(`/api/quotations/${refNo}/pdf`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button mini-gold"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '6px 12px' }}
                      >
                        Download PDF Estimate
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="wizard-actions">
            {step > 0 && <Button className="outline-dark" type="button" onClick={back} disabled={loading}><ArrowLeft size={16}/>{t('common.back')}</Button>}
            {step < 4 ? (
              <Button className="gold" type="submit"><ArrowRight size={16}/>{t('common.continue')}</Button>
            ) : refNo ? (
              <Button className="gold" type="button" onClick={() => { setRefNo(''); setNotice(''); setStep(0); }}>
                {t('common.sendAnother', 'Start New Quotation')}
              </Button>
            ) : (
              <Button className="gold" type="submit" disabled={loading}>{loading ? t('common.loading') : t('quotation.wizard.submit')}</Button>
            )}
          </div>
        </form>
      </Container>
    </PublicPage>
  );
}
