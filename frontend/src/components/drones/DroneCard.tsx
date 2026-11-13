import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import type { Drone } from '../../data/mockData';
import { Button } from '../common/Button';
import { Card3DTilt } from '../common/Card3DTilt';

export function DroneCard({ drone, index }: { drone: Drone; index: number }) {
  const { t } = useLanguage();

  return (
    <Card3DTilt maxTilt={4.5} scale={1.015}>
      <article className="product-card">
        <div className="product-image">
          <img loading="lazy" src={drone.image} alt={drone.name} />
          <span className="product-index">0{index + 1}</span>
          <span className="product-tag">{drone.tag}</span>
        </div>
        <div className="product-info">
          <h3>{drone.name}</h3>
          <p>{drone.description}</p>
          <div className="spec-row">
            {drone.specs.map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>
                <b>{value}</b>
              </div>
            ))}
          </div>
          <div className="card-actions">
            <Link to={`/drones/${drone.id}`} className="card-link">
              {t('common.viewDetails')} <ArrowUpRight size={17} />
            </Link>
            <Button className="mini-gold" to="/quotation">
              {t('common.getQuotation')}
            </Button>
          </div>
        </div>
      </article>
    </Card3DTilt>
  );
}

export default DroneCard;
