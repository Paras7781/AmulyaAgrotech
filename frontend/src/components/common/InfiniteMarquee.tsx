import React from 'react';
import { useLanguage } from '../../i18n';
import './infiniteMarquee.css';

interface InfiniteMarqueeProps {
  items?: string[];
  speed?: number; // duration in seconds
  reverse?: boolean;
  variant?: 'dark' | 'gold' | 'subtle';
  ariaLabel?: string;
  className?: string;
}

export function InfiniteMarquee({
  items,
  speed = 36,
  reverse = false,
  variant = 'dark',
  ariaLabel = 'Agricultural Highlights',
  className = '',
}: InfiniteMarqueeProps) {
  const { t } = useLanguage();

  const fallbackItems = [
    'PRECISION AGRICULTURE',
    'DRONE TECHNOLOGY',
    'SMARTER FARMING',
    'FIELD INTELLIGENCE',
    'AGRICULTURAL INNOVATION',
    'AMULYA AGROTECH',
  ];

  const translatedMarquee = t('common.marqueeItems');
  const marqueeItems =
    items && items.length > 0
      ? items
      : (translatedMarquee && typeof translatedMarquee === 'string' && translatedMarquee.includes('|')
          ? translatedMarquee.split('|')
          : fallbackItems);

  return (
    <div
      className={`infinite-marquee-band variant-${variant} ${reverse ? 'is-reversed' : ''} ${className}`}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div
        className="infinite-marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {/* Track 1 */}
        <div className="infinite-marquee-group" aria-hidden="false">
          {marqueeItems.map((item, index) => (
            <span className="marquee-item" key={`orig-${index}-${item}`}>
              <span className="marquee-text">{item}</span>
              <span className="marquee-separator" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <polygon points="5,0 10,5 5,10 0,5" />
                </svg>
              </span>
            </span>
          ))}
        </div>

        {/* Track 2 (Duplicated for seamless loop without jump) */}
        <div className="infinite-marquee-group" aria-hidden="true">
          {marqueeItems.map((item, index) => (
            <span className="marquee-item" key={`dup-${index}-${item}`}>
              <span className="marquee-text">{item}</span>
              <span className="marquee-separator" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <polygon points="5,0 10,5 5,10 0,5" />
                </svg>
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfiniteMarquee;
