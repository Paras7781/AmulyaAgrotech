import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LandmarkConfig } from './types';

interface LandmarkData {
  number: string;
  name: string;
  shortName: string;
  description: string;
  detail: string;
  tag: string;
  route: string;
}

interface LandmarkDetailPanelProps {
  config: LandmarkConfig | null;
  data: LandmarkData | null;
  isPinned: boolean;
  onClose: () => void;
  onSelectPrev: () => void;
  onSelectNext: () => void;
  currentIndex: number;
  totalCount: number;
  t: (key: string, fallback?: string) => string;
}

export const LandmarkDetailPanel: React.FC<LandmarkDetailPanelProps> = ({
  config,
  data,
  isPinned,
  onClose,
  onSelectPrev,
  onSelectNext,
  currentIndex,
  totalCount,
  t,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPinned) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPinned, onClose]);

  if (!config || !data) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div
      ref={panelRef}
      className={`farm-detail-panel ${isPinned ? 'is-pinned' : 'is-preview'}`}
      role="region"
      aria-live="polite"
      aria-label={`${data.number} ${data.name} information`}
    >
      <div className="farm-detail-panel-inner">
        {/* Top Header Bar */}
        <div className="farm-panel-header">
          <div className="farm-panel-tags">
            <span className="farm-panel-num">{data.number}</span>
            <span className="farm-panel-tag">{data.tag}</span>
          </div>

          <div className="farm-panel-actions">
            {isPinned && (
              <button
                type="button"
                className="farm-panel-close-btn"
                onClick={onClose}
                aria-label={t('home.interactiveFarm.closeButton', 'Close panel')}
              >
                <X size={18} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* Visual Preview Media */}
        <div className="farm-panel-media">
          <img src={config.image} alt={data.name} loading="lazy" />
          <div className="farm-panel-media-overlay" aria-hidden="true" />
          <div className="farm-panel-media-badge">
            <Icon size={14} strokeWidth={2.2} />
            <span>{data.shortName || data.name}</span>
          </div>
        </div>

        {/* Panel Content Body */}
        <div className="farm-panel-body">
          <h3 className="farm-panel-title">{data.name}</h3>
          <p className="farm-panel-desc">{data.description}</p>
          {isPinned && data.detail && (
            <p className="farm-panel-detail">{data.detail}</p>
          )}

          {/* Action Route Button */}
          <div className="farm-panel-cta-row">
            <Link
              to={config.route}
              className="button gold farm-panel-explore-link"
              aria-label={`${t('home.interactiveFarm.exploreButton', 'Explore')} ${data.name}`}
            >
              <span>{t('home.interactiveFarm.exploreButton', 'Explore')} {data.name}</span>
              <ArrowUpRight size={17} strokeWidth={2.2} />
            </Link>
          </div>
        </div>

        {/* Bottom Pagination & Nav */}
        <div className="farm-panel-footer">
          <div className="farm-panel-counter">
            <span>{data.number}</span>
            <span className="farm-counter-sep">/</span>
            <span>0{totalCount}</span>
          </div>

          <div className="farm-panel-nav-buttons">
            <button
              type="button"
              className="farm-nav-btn prev"
              onClick={onSelectPrev}
              aria-label={t('home.interactiveFarm.prevLandmark', 'Previous landmark')}
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="farm-nav-btn next"
              onClick={onSelectNext}
              aria-label={t('home.interactiveFarm.nextLandmark', 'Next landmark')}
            >
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

