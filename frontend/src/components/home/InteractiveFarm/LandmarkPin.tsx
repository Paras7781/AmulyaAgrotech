import React from 'react';
import type { LandmarkConfig, LandmarkId } from './types';

interface LandmarkPinProps {
  config: LandmarkConfig;
  name: string;
  shortName: string;
  isActive: boolean;
  isHovered: boolean;
  onSelect: (id: LandmarkId) => void;
  onHover: (id: LandmarkId | null) => void;
}

export const LandmarkPin: React.FC<LandmarkPinProps> = ({
  config,
  name,
  shortName,
  isActive,
  isHovered,
  onSelect,
  onHover,
}) => {
  const Icon = config.icon;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(config.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(config.id);
    }
  };

  return (
    <div
      className={`farm-landmark-pin-wrapper ${isActive ? 'is-active' : ''} ${
        isHovered ? 'is-hovered' : ''
      }`}
      style={{
        left: `${config.xPercent}%`,
        top: `${config.yPercent}%`,
      }}
    >
      <button
        type="button"
        className="farm-landmark-pin-btn"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => onHover(config.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(config.id)}
        onBlur={() => onHover(null)}
        aria-label={`${config.number} ${name}`}
        aria-expanded={isActive}
        tabIndex={0}
      >
        {/* Pulsing Beacon Waves */}
        <span className="farm-pin-beacon" aria-hidden="true" />
        <span className="farm-pin-glow" aria-hidden="true" />

        {/* Pin Center Core */}
        <span className="farm-pin-core">
          <span className="farm-pin-num">{config.number}</span>
          <Icon size={14} className="farm-pin-icon" strokeWidth={2.2} />
        </span>

        {/* Expandable Landmark Label Chip */}
        <span className="farm-pin-chip" aria-hidden="true">
          <span className="farm-chip-num">{config.number}</span>
          <span className="farm-chip-name">{shortName || name}</span>
        </span>
      </button>
    </div>
  );
};

