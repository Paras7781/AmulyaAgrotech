import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LandmarkConfig, LandmarkId } from './types';

interface LandmarkData {
  number: string;
  name: string;
  shortName: string;
  description: string;
  detail: string;
  tag: string;
  route: string;
}

interface LandmarkQuickGridProps {
  landmarks: LandmarkConfig[];
  landmarksData: Record<string, LandmarkData>;
  activeId: LandmarkId | null;
  onSelect: (id: LandmarkId) => void;
  t: (key: string, fallback?: string) => string;
}

export const LandmarkQuickGrid: React.FC<LandmarkQuickGridProps> = ({
  landmarks,
  landmarksData,
  activeId,
  onSelect,
  t,
}) => {
  return (
    <div className="farm-quick-directory">
      <div className="farm-quick-directory-header">
        <span className="farm-quick-eyebrow">
          <i /> {t('home.interactiveFarm.quickListTitle', 'Farm Landmarks')}
        </span>
        <p className="farm-quick-instruction">
          {t(
            'home.interactiveFarm.mobileInstruction',
            'Tap any landmark or choose from the directory below to explore.'
          )}
        </p>
      </div>

      <div className="farm-quick-grid">
        {landmarks.map((landmark) => {
          const data = landmarksData[landmark.key];
          const Icon = landmark.icon;
          const isActive = activeId === landmark.id;

          if (!data) return null;

          return (
            <div
              key={landmark.id}
              className={`farm-quick-card ${isActive ? 'is-active' : ''}`}
            >
              <button
                type="button"
                className="farm-quick-card-btn"
                onClick={() => onSelect(landmark.id)}
                aria-pressed={isActive}
                aria-label={`${data.number} ${data.name}`}
              >
                <div className="farm-quick-card-top">
                  <span className="farm-quick-num">{data.number}</span>
                  <div className="farm-quick-icon-wrap">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <span className="farm-quick-tag">{data.tag}</span>
                </div>

                <div className="farm-quick-card-content">
                  <h4 className="farm-quick-title">{data.name}</h4>
                  <p className="farm-quick-desc">{data.description}</p>
                </div>
              </button>

              <div className="farm-quick-card-action">
                <Link
                  to={landmark.route}
                  className="farm-quick-route-link"
                  aria-label={`${t('home.interactiveFarm.exploreButton', 'Explore')} ${data.name}`}
                >
                  <span>{t('home.interactiveFarm.exploreButton', 'Explore')}</span>
                  <ArrowUpRight size={15} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

