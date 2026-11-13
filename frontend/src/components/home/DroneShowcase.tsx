import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Box, Camera, Check, Info, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { getDrones } from '../../data/mockData';
import { Button } from '../common/Button';
import { Container } from '../common/Container';
import { LazyDrone3DCanvas } from './LazyDrone3DCanvas';

interface DroneHotspot {
  id: string;
  title: string;
  badge: string;
  detail: string;
}

export function DroneShowcase() {
  const { language, t } = useLanguage();
  const drones = getDrones(language);
  const [active, setActive] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [selectedHotspot, setSelectedHotspot] = useState<DroneHotspot | null>(null);

  const drone = drones[active];
  const next = () => {
    setActive(index => (index + 1) % drones.length);
    setSelectedHotspot(null);
  };

  const HOTSPOTS: DroneHotspot[] = [
    {
      id: 'atomizers',
      title: 'Centrifugal Micron Atomizers',
      badge: '50-300μm DROPLETS',
      detail:
        'Dual pressure atomizing nozzles create uniform micro-droplets that adhere directly to crop foliage, eliminating chemical run-off and reducing water usage by up to 90%.',
    },
    {
      id: 'radar',
      title: '360° Spherical Terrain Radar',
      badge: 'OMNIDIRECTIONAL',
      detail:
        'Continuously tracks agricultural ground slope and detects power lines, orchards, and field obstacles with automated obstacle avoidance in real-time.',
    },
    {
      id: 'battery',
      title: 'Quick-Swap Smart Flight Pack',
      badge: 'RAPID CHARGING',
      detail:
        'High-density LiPo power architecture supporting fast battery swap in under 60 seconds for continuous, non-stop spray missions during critical sowing seasons.',
    },
    {
      id: 'airframe',
      title: 'Aviation-Grade Carbon Frame',
      badge: 'IP67 SEALED',
      detail:
        'Foldable carbon fiber arms with reinforced joints engineered for rigorous field conditions, resistant to agrochemical corrosion and moisture.',
    },
  ];

  return (
    <section className="drone-showcase" id="drones">
      <Container>
        {/* Header with Title and Mode Controls */}
        <div className="showcase-heading">
          <div>
            <span className="eyebrow dark">
              <i /> {t('home.drones.kicker')}
            </span>
            <h2>
              {t('home.drones.title')}
              <br />
              <em>{t('home.drones.titleAccent')}</em>
            </h2>
          </div>

          <div className="showcase-controls">
            {/* 3D vs Photo View Toggle */}
            <div className="showcase-view-toggle" role="group" aria-label="View Mode">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === '3d' ? 'active' : ''}`}
                onClick={() => setViewMode('3d')}
                title="Switch to Realtime 3D Model"
              >
                <Box size={14} />
                <span>3D MODEL</span>
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'photo' ? 'active' : ''}`}
                onClick={() => setViewMode('photo')}
                title="Switch to High-Res Photography"
              >
                <Camera size={14} />
                <span>PHOTO</span>
              </button>
            </div>

            {/* Model Number Pills */}
            <div className="showcase-nav-pills" role="tablist" aria-label="Drone navigation">
              {drones.map((d, index) => (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  className={`showcase-nav-pill ${active === index ? 'active' : ''}`}
                  onClick={() => {
                    setActive(index);
                    setSelectedHotspot(null);
                  }}
                  aria-label={`Select ${d.name}`}
                >
                  0{index + 1}
                </button>
              ))}
            </div>

            <span className="showcase-count">
              0{active + 1} / 0{drones.length}
            </span>
          </div>
        </div>

        {/* Main Showcase Stage */}
        <div className="showcase-stage">
          {/* Visual Presentation Area (3D WebGL Canvas OR Photo) */}
          <div className="showcase-visual-wrapper">
            {viewMode === '3d' ? (
              <div className="showcase-3d-stage">
                <LazyDrone3DCanvas
                  key={`3d-${drone.id}`}
                  variant="showcase"
                  autoRotate={true}
                  interactive={true}
                  showSpray={drone.id === 1}
                />

                {/* Hotspot Floating Buttons */}
                <div className="showcase-hotspots-overlay" aria-label="Interactive Product Features">
                  {HOTSPOTS.map((spot, i) => (
                    <button
                      key={spot.id}
                      type="button"
                      className={`hotspot-pin-btn hotspot-pos-${i + 1} ${
                        selectedHotspot?.id === spot.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedHotspot(selectedHotspot?.id === spot.id ? null : spot)}
                      aria-label={`View feature: ${spot.title}`}
                      title={spot.title}
                    >
                      <span className="hotspot-pulse" />
                      <span className="hotspot-dot">
                        <Sparkles size={11} />
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Hotspot Modal/Popover */}
                {selectedHotspot && (
                  <div className="hotspot-detail-card">
                    <button
                      type="button"
                      className="hotspot-close"
                      onClick={() => setSelectedHotspot(null)}
                      aria-label="Close feature details"
                    >
                      <X size={14} />
                    </button>
                    <span className="hotspot-badge">{selectedHotspot.badge}</span>
                    <h4>{selectedHotspot.title}</h4>
                    <p>{selectedHotspot.detail}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="showcase-image" key={`image-${drone.id}`}>
                <img src={drone.image} alt={drone.name} />
                <span>{drone.tag}</span>
              </div>
            )}
          </div>

          {/* Technical Copy & Actions */}
          <div className="showcase-copy" key={`copy-${drone.id}`}>
            <span className="eyebrow dark">
              <i /> {drone.category}
            </span>
            <h3>{drone.name}</h3>
            <h2>
              {t('home.hero.precision')}
              <br />
              <em>{t('home.hero.efficiency')}</em>
            </h2>
            <p>{drone.description}</p>

            <div className="showcase-specs">
              {drone.specs.slice(0, 3).map(([label, value]) => (
                <div key={label}>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="showcase-actions">
              <Button className="gold" to={`/drones/${drone.id}`}>
                {t('common.viewDrone')} <ArrowUpRight size={17} />
              </Button>
              <button className="next-drone" onClick={next}>
                {t('common.nextDrone')} <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        <Link className="showcase-all" to="/drones">
          {t('common.viewFullFleet')} <ArrowUpRight size={17} />
        </Link>
      </Container>
    </section>
  );
}

export default DroneShowcase;
