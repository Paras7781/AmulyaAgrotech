import { getFeatures } from '../../data/mockData';
import { useLanguage } from '../../i18n';
import { Card3DTilt } from '../common/Card3DTilt';

export function FeatureStrip() {
  const { language, t } = useLanguage();
  const features = getFeatures(language);

  return (
    <section className="feature-strip">
      <div className="feature-strip-intro">
        <span>{t('home.featureStrip.prefix')}</span>
        <p>{t('home.featureStrip.title')}</p>
      </div>

      <div className="feature-strip-items">
        {features.map(({ icon: Icon, title, text }, index) => (
          <Card3DTilt key={title} maxTilt={4} scale={1.012} style={{ height: '100%' }}>
            <div className="feature-item" style={{ height: '100%' }}>
              <div className="feature-number">0{index + 1}</div>
              <div className="feature-icon">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="feature-content">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <div className="feature-line" />
            </div>
          </Card3DTilt>
        ))}
      </div>
    </section>
  );
}

export default FeatureStrip;
