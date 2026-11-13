import React, { useMemo, useState } from 'react';
import { useLanguage } from '../../../i18n';
import { FarmLandscapeSvg } from './FarmLandscapeSvg';
import { LandmarkDetailPanel } from './LandmarkDetailPanel';
import { LandmarkPin } from './LandmarkPin';
import { LandmarkQuickGrid } from './LandmarkQuickGrid';
import { LANDMARKS } from './landmarksData';
import type { LandmarkId } from './types';
import './interactiveFarm.css';

export function InteractiveFarm() {
  const { t } = useLanguage();
  const [activeLandmarkId, setActiveLandmarkId] = useState<LandmarkId | null>('drones');
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState<LandmarkId | null>(null);
  const [landscapeTilt, setLandscapeTilt] = useState({ x: 0, y: 0 });

  const handleLandscapeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 900) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3.2;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -2.4;
    setLandscapeTilt({ x: rotateX, y: rotateY });
  };

  const handleLandscapeMouseLeave = () => {
    setLandscapeTilt({ x: 0, y: 0 });
  };

  // Map translations for all landmarks
  const landmarksData = useMemo(() => {
    const dataMap: Record<
      string,
      {
        number: string;
        name: string;
        shortName: string;
        description: string;
        detail: string;
        tag: string;
        route: string;
      }
    > = {};

    LANDMARKS.forEach((l) => {
      dataMap[l.key] = {
        number: t(`home.interactiveFarm.landmarks.${l.key}.number`, l.number),
        name: t(`home.interactiveFarm.landmarks.${l.key}.name`, l.key.toUpperCase()),
        shortName: t(
          `home.interactiveFarm.landmarks.${l.key}.shortName`,
          l.key.toUpperCase()
        ),
        description: t(
          `home.interactiveFarm.landmarks.${l.key}.description`,
          ''
        ),
        detail: t(`home.interactiveFarm.landmarks.${l.key}.detail`, ''),
        tag: t(`home.interactiveFarm.landmarks.${l.key}.tag`, 'AMULYA'),
        route: l.route,
      };
    });

    return dataMap;
  }, [t]);

  // Active / current landmark config and data
  const currentId = activeLandmarkId ?? hoveredLandmarkId ?? 'drones';
  const currentConfig = useMemo(
    () => LANDMARKS.find((l) => l.id === currentId) ?? LANDMARKS[0],
    [currentId]
  );
  const currentData = landmarksData[currentConfig.key];
  const currentIndex = LANDMARKS.findIndex((l) => l.id === currentConfig.id);

  const handleSelect = (id: LandmarkId) => {
    setActiveLandmarkId(id);
  };

  const handleClose = () => {
    setActiveLandmarkId(null);
  };

  const handleSelectNext = () => {
    const nextIdx = (currentIndex + 1) % LANDMARKS.length;
    setActiveLandmarkId(LANDMARKS[nextIdx].id);
  };

  const handleSelectPrev = () => {
    const prevIdx = (currentIndex - 1 + LANDMARKS.length) % LANDMARKS.length;
    setActiveLandmarkId(LANDMARKS[prevIdx].id);
  };

  return (
    <section className="farm-experience-section" id="explore-farm">
      <div className="farm-container">
        {/* Section Header */}
        <div className="farm-section-header">
          <div className="farm-header-split">
            <div className="farm-header-left">
              <span className="eyebrow dark">
                <i /> {t('home.interactiveFarm.kicker', 'AMULYA INTERACTIVE / 02')}
              </span>
              <h2>
                {t('home.interactiveFarm.title', 'Explore the World of')}{' '}
                <em>{t('home.interactiveFarm.titleAccent', 'Amulya.')}</em>
              </h2>
            </div>

            <div className="farm-header-right">
              <p>
                {t(
                  'home.interactiveFarm.subtitle',
                  'A conceptual modern farm mapping our drone fleet, precision spraying, on-ground operations, subsidy advisory, field gallery, and quotation workflows.'
                )}
              </p>
              <div className="farm-header-cue">
                <span className="farm-header-cue-dot" aria-hidden="true" />
                <span>
                  {t(
                    'home.interactiveFarm.instruction',
                    'Hover over landmarks to discover them. Click to open detailed insights and routes.'
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage: Interactive Landscape & HUD */}
        <div className="farm-stage-wrap">
          {/* Top HUD Bar */}
          <div className="farm-stage-hud">
            <div className="farm-hud-left">
              <span className="farm-hud-dot" aria-hidden="true" />
              <span>
                {t('home.interactiveFarm.viewLandscape', 'Interactive Farm Landscape')}
              </span>
            </div>

            <div className="farm-hud-center">
              <span>{t('home.interactiveFarm.activeLandmark', 'Active Landmark')}:</span>{' '}
              <strong style={{ color: 'var(--gold, #f2c230)' }}>
                {currentData ? currentData.name : ''}
              </strong>
            </div>

            <div className="farm-hud-right">
              <span className="farm-hud-count">
                {currentData?.number || '01'} / 0{LANDMARKS.length}
              </span>
            </div>
          </div>

          {/* Landscape Canvas & Overlay Pins with 3D Depth */}
          <div
            className="farm-canvas-container"
            onMouseMove={handleLandscapeMouseMove}
            onMouseLeave={handleLandscapeMouseLeave}
            style={{
              transform: `perspective(1200px) rotateX(${landscapeTilt.x.toFixed(2)}deg) rotateY(${landscapeTilt.y.toFixed(2)}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* SVG Farm Landscape */}
            <FarmLandscapeSvg
              activeLandmark={activeLandmarkId}
              hoveredLandmark={hoveredLandmarkId}
              onLandmarkSelect={handleSelect}
            />

            {/* Accessible Interactive Landmark Pins */}
            <div className="farm-pins-layer">
              {LANDMARKS.map((landmark) => {
                const data = landmarksData[landmark.key];
                return (
                  <LandmarkPin
                    key={landmark.id}
                    config={landmark}
                    name={data?.name || ''}
                    shortName={data?.shortName || ''}
                    isActive={activeLandmarkId === landmark.id}
                    isHovered={hoveredLandmarkId === landmark.id}
                    onSelect={handleSelect}
                    onHover={setHoveredLandmarkId}
                  />
                );
              })}
            </div>

            {/* Detail Information Panel (Docked Overlay) */}
            {activeLandmarkId && (
              <LandmarkDetailPanel
                config={currentConfig}
                data={currentData}
                isPinned={Boolean(activeLandmarkId)}
                onClose={handleClose}
                onSelectPrev={handleSelectPrev}
                onSelectNext={handleSelectNext}
                currentIndex={currentIndex}
                totalCount={LANDMARKS.length}
                t={t}
              />
            )}
          </div>
        </div>

        {/* Responsive Quick Directory below Landscape */}
        <LandmarkQuickGrid
          landmarks={LANDMARKS}
          landmarksData={landmarksData}
          activeId={activeLandmarkId}
          onSelect={handleSelect}
          t={t}
        />
      </div>
    </section>
  );
}
export default InteractiveFarm;

