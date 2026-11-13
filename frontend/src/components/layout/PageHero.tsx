import type { ReactNode } from 'react';
import { media } from '../../data/mockData';
export function PageHero({ kicker, title, image = media.field }: { kicker: string; title: ReactNode; image?: string }) { return <div className="page-hero" style={{ backgroundImage: `url(${image})` }}><div className="hero-shade"/><div className="page-hero-content"><div className="eyebrow"><span/> {kicker}</div><h1>{title}</h1></div></div>; }
