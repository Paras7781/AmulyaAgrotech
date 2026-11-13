import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../i18n';
import { Container } from '../components/common/Container';
import { PublicPage } from '../components/layout/PublicPage';
import { getGallery } from '../data/mockData';

export function GalleryPage() {
  const { language, t } = useLanguage();
  const gallery = getGallery(language);
  const categories = t('drones.categories').split('|');
  const [filter, setFilter] = useState(categories[0]);
  const [selected, setSelected] = useState<number | null>(null);
  const visible = filter === categories[0] ? gallery : gallery.filter(item => item.category === filter);
  const selectedIndex = selected === null ? -1 : visible.findIndex(item => item === gallery[selected]);
  const move = (direction: number) => {
    if (selectedIndex < 0) return;
    setSelected(gallery.indexOf(visible[(selectedIndex + direction + visible.length) % visible.length]));
  };

  useEffect(() => {
    setFilter(categories[0]);
    setSelected(null);
  }, [language]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (selected === null) return;
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };

    document.body.classList.toggle('gallery-open', selected !== null);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('gallery-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selected, filter]);

  return (
    <PublicPage heroKey="gallery" kicker={t('galleryPage.kicker')} title={<>{t('galleryPage.title')}<br /><em>{t('galleryPage.titleAccent')}</em></>}>
      <Container className="gallery-page">
        <div className="gallery-intro">
          <p>{t('galleryPage.intro')}</p>
        </div>
        <div className="gallery-filters" role="tablist" aria-label={t('galleryPage.categoriesAria')}>
          {categories.map(category => (
            <button role="tab" aria-selected={filter === category} className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)} key={category}>{category}</button>
          ))}
        </div>
        {visible.length ? (
          <div className="masonry-gallery">
            {visible.map((item, index) => (
              <button className={`masonry-tile tile-${index + 1}`} onClick={() => setSelected(gallery.indexOf(item))} key={`${item.category}-${index}`}>
                <img loading="lazy" src={item.image} alt={item.alt} />
                <span>{item.category}<ChevronRight size={15} /></span>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>{t('galleryPage.noImages')}</p></div>
        )}
      </Container>

      {selected !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={t('galleryPage.lightbox')} onClick={() => setSelected(null)}>
          <button className="lightbox-close" aria-label={t('galleryPage.close')} onClick={() => setSelected(null)}><X /></button>
          <button className="lightbox-prev" aria-label={t('galleryPage.previous')} onClick={event => { event.stopPropagation(); move(-1); }}><ChevronLeft /></button>
          <img src={gallery[selected].image} alt={gallery[selected].alt} onClick={event => event.stopPropagation()} />
          <button className="lightbox-next" aria-label={t('galleryPage.next')} onClick={event => { event.stopPropagation(); move(1); }}><ChevronRight /></button>
        </div>
      )}
    </PublicPage>
  );
}
