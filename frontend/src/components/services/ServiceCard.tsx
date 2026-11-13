import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card3DTilt } from '../common/Card3DTilt';

export function ServiceCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <Card3DTilt maxTilt={5} scale={1.02}>
      <article className="service-card">
        <Icon />
        <h3>{title}</h3>
        <p>{text}</p>
        <span>
          <ArrowUpRight size={17} />
        </span>
      </article>
    </Card3DTilt>
  );
}

export default ServiceCard;
