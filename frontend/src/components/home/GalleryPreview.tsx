import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGallery } from '../../data/mockData';
import { useLanguage } from '../../i18n';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

export function GalleryPreview() {
  const { language, t } = useLanguage();
  const gallery = getGallery(language);

  return <Container className="gallery-preview"><SectionHeading kicker={t('home.gallery.kicker')} title={<>{t('home.gallery.title')}<br/><em>{t('home.gallery.titleAccent')}</em></>} copy={<><p>{t('home.gallery.subtitle')}</p><Link className="text-link" to="/gallery">{t('common.viewFullFleet')} <ArrowUpRight size={17}/></Link></>}/><div className="gallery-preview-grid">{gallery.slice(0, 3).map((item, index) => <Link className={`gallery-preview-item item-${index + 1}`} to="/gallery" key={item.image}><img loading="lazy" src={item.image} alt={item.alt}/><span>{item.category}<ArrowUpRight size={16}/></span></Link>)}</div></Container>;
}
