import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useLanguage } from '../i18n';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <PublicPage
      heroKey="about"
      kicker={t('notFoundPage.kicker', '404 ERROR')}
      title={
        <>
          {t('notFoundPage.title', 'Page Not')}{' '}
          <em>{t('notFoundPage.titleAccent', 'Found.')}</em>
        </>
      }
    >
      <Container className="not-found-page">
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '60px 0' }}>
          <span className="eyebrow dark" style={{ marginBottom: '16px' }}>
            <i /> {t('notFoundPage.kicker', '404 ERROR')}
          </span>
          <h2
            style={{
              font: "500 clamp(36px, 5vw, 56px) / 1.05 'Space Grotesk', sans-serif",
              margin: '18px 0',
              letterSpacing: '-0.03em',
            }}
          >
            {t('notFoundPage.title', 'Page Not')}{' '}
            <em style={{ color: 'var(--gold, #f2c230)' }}>
              {t('notFoundPage.titleAccent', 'Found.')}
            </em>
          </h2>
          <p
            style={{
              color: 'var(--muted, #686d61)',
              fontSize: '16px',
              lineHeight: '1.7',
              marginBottom: '32px',
            }}
          >
            {t(
              'notFoundPage.subtitle',
              'The agricultural page or resource you are looking for does not exist or has been moved.'
            )}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button className="gold" to="/">
              <ArrowLeft size={16} />
              {t('notFoundPage.homeButton', 'Back to Home')}
            </Button>
            <Button className="outline-dark" to="/contact">
              <MessageSquare size={16} />
              {t('notFoundPage.contactButton', 'Contact Us')}
            </Button>
          </div>
        </div>
      </Container>
    </PublicPage>
  );
}

export default NotFoundPage;
