import { Facebook, Instagram, MessageCircle, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer>
      <div>
        <Link to="/" className="logo">
          <span>
            <b>AMULYA</b>
            <small>AGROTECH (P) LTD</small>
          </span>
        </Link>
        <p>{t('footer.description')}</p>
        <div className="footer-social" aria-label={t('common.socialSoon')}>
          <span title={t('footer.social.whatsapp', 'WhatsApp')}><MessageCircle size={17}/></span>
          <span title={t('footer.social.instagram', 'Instagram')}><Instagram size={17}/></span>
          <span title={t('footer.social.facebook', 'Facebook')}><Facebook size={17}/></span>
          <span title={t('footer.social.youtube', 'YouTube')}><Youtube size={17}/></span>
        </div>
      </div>
      <div className="footer-links">
        <div>
          <b>{t('footer.explore')}</b>
          <Link to="/">{t('footer.home')}</Link>
          <Link to="/about">{t('footer.about')}</Link>
          <Link to="/drones">{t('footer.drones')}</Link>
          <Link to="/gallery">{t('footer.gallery')}</Link>
        </div>
        <div>
          <b>{t('footer.servicesTitle')}</b>
          <Link to="/services">{t('footer.sales')}</Link>
          <Link to="/services">{t('footer.spraying')}</Link>
          <Link to="/subsidy">{t('footer.subsidy')}</Link>
        </div>
        <div>
          <b>{t('footer.connect')}</b>
          <Link to="/contact">{t('footer.contact')}</Link>
          <a href="tel:7972908815">7972908815</a>
          <a href="tel:8317711711">8317711711</a>
          <span>{t('common.socialSoon')}</span>
        </div>
        <div>
          <b>{t('footer.visit')}</b>
          <span>{t('contact.address')}</span>
        </div>
      </div>
      <small className="copyright">{t('footer.copyright')}</small>
    </footer>
  );
}
