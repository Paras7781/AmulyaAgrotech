import { useState, type FormEvent, type ChangeEvent } from 'react';
import { AlertCircle, Check, Clock3, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../i18n';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';
import { getServices } from '../data/mockData';
import { isValidIndianMobile, submitContactForm } from '../api/client';

export function ContactPage() {
  const { language, t } = useLanguage();
  const services = getServices(language);
  const [sent, setSent] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [partialDelivery, setPartialDelivery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    service: '',
    message: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const trimmed = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      location: formData.location.trim(),
      service: formData.service.trim(),
      message: formData.message.trim(),
    };

    if (trimmed.name.length < 2) return 'Please enter at least 2 characters for your name.';
    if (!isValidIndianMobile(trimmed.phone)) return 'Please enter a valid 10-digit Indian mobile number.';
    if (trimmed.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) return 'Please enter a valid email address.';
    if (!trimmed.location) return 'Please enter your location.';
    if (!trimmed.service) return 'Please select the requirement you need help with.';
    if (!trimmed.message) return 'Please enter your enquiry message.';

    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        location: formData.location.trim(),
        service: formData.service.trim(),
        message: formData.message.trim(),
        language,
      };

      const res = await submitContactForm(payload);
      setReferenceNumber(res.reference_number ?? '');
      setPartialDelivery(res.status === 'PARTIAL');
      setSuccessMessage(res.status === 'PARTIAL' ? res.message : '');
      setSent(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error submitting enquiry. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setReferenceNumber('');
    setSuccessMessage('');
    setPartialDelivery(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      location: '',
      service: '',
      message: '',
    });
  };

  return (
    <PublicPage heroKey="contact" kicker={t('contact.kicker')} title={<>{t('contact.title')}<br/><em>{t('contact.titleAccent')}</em></>}>
      <Container className="contact-page">
        <div className="contact-side">
          <span className="eyebrow dark"><i/> AMULYA AGROTECH</span>
          <h2>{t('contact.form.name')}<br/>{t('contact.form.requirement')}</h2>
          <p>{t('contact.intro')}</p>
          <div className="contact-detail"><MapPin/><span>{t('contact.address')}</span></div>
          <a href="tel:7972908815"><Phone/>7972908815</a>
          <a href="tel:8317711711"><Phone/>8317711711</a>
          <div className="contact-detail"><Clock3/><span>{t('contact.businessHours')}<br/>{t('contact.actionText')}</span></div>
          <p className="contact-email">{t('contact.emailText')}</p>
        </div>
        <form className="enquiry-form contact-form" onSubmit={handleSubmit}>
          {sent ? (
            <div className="success" role={partialDelivery ? 'alert' : 'status'} aria-live={partialDelivery ? 'assertive' : 'polite'}>
              {partialDelivery ? <AlertCircle size={32}/> : <Check size={32}/>}
              <h3>{t('contact.form.successTitle')}</h3>
              <p>{successMessage || t('contact.form.successText')}</p>
              {referenceNumber && (
                <p style={{ fontSize: '13px', color: 'var(--gold, #f2c230)', fontFamily: "'DM Mono', monospace", margin: '8px 0 16px' }}>
                  Enquiry reference: {referenceNumber}
                </p>
              )}
              <Button className="gold" type="button" onClick={handleReset}>{t('common.sendAnother')}</Button>
            </div>
          ) : (
            <>
              <div className="eyebrow dark"><i/> {t('contact.form.eyebrow')}</div>
              {errorMsg && <div className="form-error" role="alert" style={{ color: '#e53935', fontSize: '0.9rem', marginBottom: '1rem' }}>{errorMsg}</div>}
              <label htmlFor="name">{t('contact.form.name')}<input id="name" name="name" value={formData.name} onChange={handleChange} required maxLength={120} autoComplete="name" placeholder={t('contact.form.namePlaceholder')}/></label>
              <label htmlFor="phone">{t('contact.form.phone')}<input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={formData.phone} onChange={handleChange} required placeholder={t('contact.form.phonePlaceholder')}/></label>
              <label htmlFor="email">{t('contact.form.email')}<input id="email" name="email" value={formData.email} onChange={handleChange} type="email" maxLength={180} autoComplete="email" placeholder={t('contact.form.emailPlaceholder')}/></label>
              <label htmlFor="location">{t('contact.form.location')}<input id="location" name="location" value={formData.location} onChange={handleChange} required maxLength={180} autoComplete="address-level2" placeholder={t('contact.form.locationPlaceholder')}/></label>
              <label htmlFor="service">{t('contact.form.requirement')}<select id="service" name="service" value={formData.service} onChange={handleChange} required><option value="" disabled>{t('contact.form.selectRequirement')}</option>{services.map(service => <option key={service.title} value={service.title}>{service.title}</option>)}</select></label>
              <label htmlFor="message">{t('contact.form.message')}<textarea id="message" name="message" value={formData.message} onChange={handleChange} required maxLength={2000} rows={5} placeholder={t('contact.form.messagePlaceholder')}/></label>
              <Button className="gold" type="submit" disabled={loading}>{loading ? t('common.loading') : t('contact.form.send')}</Button>
            </>
          )}
        </form>
      </Container>
    </PublicPage>
  );
}
