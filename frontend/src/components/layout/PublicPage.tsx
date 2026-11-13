import { useEffect, type ReactNode } from 'react';
import { useLanguage } from '../../i18n';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { PageHero } from './PageHero';
import { media } from '../../data/mockData';

const heroImageMap: Record<string, string> = {
  about: media.field,
  drones: media.drone,
  services: media.crop,
  subsidy: media.field,
  gallery: media.crop,
  contact: media.field,
  quotation: media.drone,
};

export function PublicPage({ children, kicker, title, image, heroKey }: { children: ReactNode; kicker: string; title: ReactNode; image?: string; heroKey?: string }) {
  useEffect(() => { document.title = `${typeof title === 'string' ? title : kicker} | Amulya Agrotech`; }, [kicker, title]);
  const heroImage = image ?? (heroKey ? heroImageMap[heroKey] : undefined) ?? media.field;
  return <><Navbar/><main id="main-content"><div data-reveal className="reveal-on-scroll"><PageHero kicker={kicker} title={title} image={heroImage}/></div>{children}</main><Footer/></>;
}
