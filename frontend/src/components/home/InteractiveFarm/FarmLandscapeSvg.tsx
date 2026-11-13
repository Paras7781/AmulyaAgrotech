import React from 'react';
import type { LandmarkId } from './types';

interface FarmLandscapeSvgProps {
  activeLandmark: LandmarkId | null;
  hoveredLandmark: LandmarkId | null;
  onLandmarkSelect?: (id: LandmarkId) => void;
}

export const FarmLandscapeSvg: React.FC<FarmLandscapeSvgProps> = ({
  activeLandmark,
  hoveredLandmark,
  onLandmarkSelect,
}) => {
  const isHighlighted = (id: LandmarkId) =>
    activeLandmark === id || hoveredLandmark === id;

  return (
    <svg
      viewBox="0 0 1200 680"
      className="farm-landscape-svg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Amulya Agrotech conceptual agricultural farm illustration"
    >
      <defs>
        {/* Sky Gradients */}
        <linearGradient id="farmSkyGrad" x1="600" y1="0" x2="600" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-sky-top" stopColor="#0b130e" />
          <stop offset="65%" className="farm-sky-mid" stopColor="#142318" />
          <stop offset="100%" className="farm-sky-bottom" stopColor="#223926" />
        </linearGradient>

        <linearGradient id="sunHazeGrad" x1="820" y1="60" x2="820" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f2c230" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#f2c230" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#f2c230" stopOpacity="0" />
        </linearGradient>

        {/* Mountain Ridge Gradients */}
        <linearGradient id="mountainGradFar" x1="600" y1="90" x2="600" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-mountain-far-top" stopColor="#16271a" />
          <stop offset="100%" className="farm-mountain-far-bot" stopColor="#1e3422" />
        </linearGradient>
        <linearGradient id="mountainGradMid" x1="600" y1="120" x2="600" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-mountain-mid-top" stopColor="#1c3321" />
          <stop offset="100%" className="farm-mountain-mid-bot" stopColor="#25442b" />
        </linearGradient>

        {/* Field Gradients */}
        <linearGradient id="fieldGreenGrad1" x1="180" y1="200" x2="420" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-field-green-light" stopColor="#2d5234" />
          <stop offset="100%" className="farm-field-green-dark" stopColor="#1a3420" />
        </linearGradient>
        <linearGradient id="fieldGreenGrad2" x1="300" y1="320" x2="700" y2="540" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-field-green-light" stopColor="#325a39" />
          <stop offset="100%" className="farm-field-green-dark" stopColor="#1e3823" />
        </linearGradient>
        <linearGradient id="fieldWheatGrad" x1="750" y1="260" x2="1150" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-field-wheat-light" stopColor="#4d4424" />
          <stop offset="100%" className="farm-field-wheat-dark" stopColor="#2c2715" />
        </linearGradient>
        <linearGradient id="fieldOrchardGrad" x1="60" y1="420" x2="380" y2="680" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-field-orchard-light" stopColor="#27482d" />
          <stop offset="100%" className="farm-field-orchard-dark" stopColor="#182e1c" />
        </linearGradient>

        {/* Water Canal Gradient */}
        <linearGradient id="canalGrad" x1="200" y1="230" x2="680" y2="560" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-water-light" stopColor="#2d6470" />
          <stop offset="50%" className="farm-water-mid" stopColor="#1b414a" />
          <stop offset="100%" className="farm-water-dark" stopColor="#122c33" />
        </linearGradient>

        {/* Road & Path Gradient */}
        <linearGradient id="pathGrad" x1="350" y1="260" x2="950" y2="640" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className="farm-path-light" stopColor="#3d3d34" />
          <stop offset="100%" className="farm-path-dark" stopColor="#242520" />
        </linearGradient>

        {/* Drone Spray Mist Cone Gradient */}
        <linearGradient id="sprayMistGrad" x1="504" y1="270" x2="504" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7ad1e8" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#8be3c9" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#5cdbb5" stopOpacity="0" />
        </linearGradient>

        {/* Beacon Glow Filter */}
        <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Drone Shadow Blur Filter */}
        <filter id="droneShadowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        {/* Crop Patterns */}
        <pattern id="cropRowsPattern" width="24" height="24" patternTransform="rotate(28 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="24" className="farm-furrow-line" stroke="rgba(242, 194, 48, 0.16)" strokeWidth="1.6" />
          <line x1="12" y1="0" x2="12" y2="24" className="farm-furrow-secondary" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.8" />
        </pattern>

        <pattern id="diagonalRowsPattern" width="20" height="20" patternTransform="rotate(-34 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="20" className="farm-furrow-line-alt" stroke="rgba(242, 194, 48, 0.18)" strokeWidth="1.4" />
        </pattern>

        <pattern id="wheatHatchPattern" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="16" y2="16" stroke="rgba(242, 194, 48, 0.22)" strokeWidth="1.2" />
          <line x1="0" y1="8" x2="8" y2="16" stroke="rgba(242, 194, 48, 0.14)" strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* ====================================================
          1. SKY AND DISTANT ATMOSPHERE
          ==================================================== */}
      <rect width="1200" height="260" fill="url(#farmSkyGrad)" />
      <circle cx="820" cy="140" r="140" fill="url(#sunHazeGrad)" />

      {/* Distant Clouds / Haze */}
      <path
        d="M 120 120 Q 180 100 250 115 Q 310 130 380 120 Q 420 115 470 125 C 440 135 340 145 230 140 C 160 138 120 130 120 120 Z"
        className="farm-sky-cloud"
        fill="rgba(255, 255, 255, 0.04)"
      />
      <path
        d="M 640 90 Q 720 70 820 85 Q 910 100 990 90 Q 1050 82 1100 95 C 1060 108 960 115 850 110 C 740 105 660 98 640 90 Z"
        className="farm-sky-cloud"
        fill="rgba(242, 194, 48, 0.05)"
      />

      {/* Far Mountain Ridgeline */}
      <path
        d="M 0 210 Q 140 140 280 170 Q 420 200 560 150 Q 700 100 840 160 Q 980 220 1120 160 Q 1170 145 1200 155 L 1200 270 L 0 270 Z"
        fill="url(#mountainGradFar)"
      />

      {/* Mid Mountain Ridgeline with Forest Contour */}
      <path
        d="M 0 235 Q 160 175 320 205 Q 460 235 620 185 Q 780 135 940 195 Q 1060 235 1200 180 L 1200 310 L 0 310 Z"
        fill="url(#mountainGradMid)"
      />

      {/* Tree Line Windbreaks along Distant Horizon */}
      <g className="farm-windbreak-trees" opacity="0.75">
        {[40, 75, 110, 145, 190, 230, 275, 330, 375, 420, 465, 510, 560, 610, 660, 715, 765, 810, 860, 910, 960, 1010, 1060, 1110, 1155].map((x, i) => (
          <ellipse
            key={i}
            cx={x}
            cy={220 + Math.sin(i * 0.9) * 12}
            rx={10 + (i % 3) * 3}
            ry={16 + (i % 4) * 3}
            className="farm-tree-distant"
            fill="#162e1c"
          />
        ))}
      </g>

      {/* ====================================================
          2. AGRICULTURAL LANDSCAPE PARCELS & FIELDS
          ==================================================== */}

      {/* Main Base Field Base Layer */}
      <path
        d="M 0 240 L 1200 210 L 1200 680 L 0 680 Z"
        className="farm-base-ground"
        fill="#142618"
      />

      {/* Field Parcel A: Terraced Hillside (Top-Left, Gallery area) */}
      <path
        d="M 0 240 Q 220 230 380 270 Q 280 370 0 390 Z"
        fill="url(#fieldGreenGrad1)"
      />
      <path
        d="M 0 240 Q 220 230 380 270 Q 280 370 0 390 Z"
        fill="url(#diagonalRowsPattern)"
        opacity="0.85"
      />

      {/* Terrace Step Ridges on Parcel A */}
      <path
        d="M 20 265 Q 160 250 300 280"
        stroke="rgba(242, 194, 48, 0.3)"
        strokeWidth="2"
        strokeDasharray="4 6"
      />
      <path
        d="M 10 300 Q 140 280 280 315"
        stroke="rgba(242, 194, 48, 0.25)"
        strokeWidth="1.8"
      />
      <path
        d="M 0 340 Q 120 320 240 355"
        stroke="rgba(242, 194, 48, 0.2)"
        strokeWidth="1.5"
      />

      {/* Field Parcel B: Drone Fleet Zone (Top-Right) */}
      <path
        d="M 720 215 Q 940 205 1200 220 L 1200 370 Q 980 360 760 320 Z"
        className="farm-field-launch-ground"
        fill="#1a3220"
      />
      <path
        d="M 720 215 Q 940 205 1200 220 L 1200 370 Q 980 360 760 320 Z"
        fill="url(#cropRowsPattern)"
        opacity="0.4"
      />

      {/* Field Parcel C: Precision Spraying Central Crop Field */}
      <path
        d="M 320 275 Q 640 255 780 290 Q 720 460 360 480 Q 260 370 320 275 Z"
        fill="url(#fieldGreenGrad2)"
      />
      <path
        d="M 320 275 Q 640 255 780 290 Q 720 460 360 480 Q 260 370 320 275 Z"
        fill="url(#cropRowsPattern)"
        opacity="0.9"
      />

      {/* Field Parcel D: Golden Wheat / Grain Parcel (Mid-Right) */}
      <path
        d="M 770 305 Q 980 340 1200 350 L 1200 520 Q 960 510 740 450 Z"
        fill="url(#fieldWheatGrad)"
      />
      <path
        d="M 770 305 Q 980 340 1200 350 L 1200 520 Q 960 510 740 450 Z"
        fill="url(#wheatHatchPattern)"
        opacity="0.85"
      />

      {/* Field Parcel E: Demonstration Plots & Agro-Advisory (Bottom-Left) */}
      <path
        d="M 0 380 Q 240 360 410 440 Q 320 620 0 660 Z"
        fill="url(#fieldOrchardGrad)"
      />
      {/* Demonstration Bed Rows */}
      <g className="farm-demo-plots" opacity="0.8">
        <path d="M 40 440 L 220 430 M 35 465 L 210 455 M 30 490 L 200 480 M 25 515 L 190 505" stroke="rgba(242, 194, 48, 0.3)" strokeWidth="3" />
        <path d="M 50 545 L 215 540 M 45 570 L 205 565 M 40 595 L 195 590 M 35 620 L 180 615" stroke="rgba(93, 112, 70, 0.9)" strokeWidth="3.5" />
      </g>

      {/* Field Parcel F: Smart Operations & Quotation Corridor (Bottom-Right) */}
      <path
        d="M 460 490 Q 780 460 1200 510 L 1200 680 L 410 680 Q 380 580 460 490 Z"
        className="farm-field-lower-green"
        fill="#172b1a"
      />
      <path
        d="M 460 490 Q 780 460 1200 510 L 1200 680 L 410 680 Q 380 580 460 490 Z"
        fill="url(#cropRowsPattern)"
        opacity="0.75"
      />

      {/* ====================================================
          3. IRRIGATION CANAL NETWORK & WATER FEATURES
          ==================================================== */}
      {/* Curving Irrigation Canal */}
      <path
        d="M 240 230 C 260 290 280 340 320 390 C 360 440 420 470 470 510 C 530 560 580 600 640 680 L 600 680 C 540 605 490 565 435 520 C 385 480 330 445 290 395 C 250 345 230 295 210 230 Z"
        className="farm-canal-bank"
        fill="#222b26"
      />
      <path
        d="M 235 230 C 255 290 275 340 315 390 C 355 440 415 470 465 510 C 525 560 575 600 635 680 L 610 680 C 550 605 500 565 445 520 C 395 480 340 445 300 395 C 260 345 240 295 220 230 Z"
        fill="url(#canalGrad)"
      />

      {/* Canal Water Surface Highlights & Ripples */}
      <path
        d="M 250 310 Q 260 330 270 345 M 345 425 Q 365 445 385 460 M 470 535 Q 495 555 520 575"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Arched Stone Field Bridge crossing the Canal */}
      <g className="farm-canal-bridge">
        <path d="M 330 425 L 390 415 L 400 435 L 340 445 Z" fill="#42453e" stroke="#5a5e55" strokeWidth="1" />
        <line x1="335" y1="424" x2="395" y2="414" stroke="#f2c230" strokeWidth="1.2" opacity="0.7" />
        <line x1="345" y1="444" x2="405" y2="434" stroke="#f2c230" strokeWidth="1.2" opacity="0.7" />
      </g>

      {/* Smart Irrigation Center-Pivot Sprayer Arm */}
      <g className="farm-pivot-irrigation" transform="translate(620, 390)">
        <circle cx="0" cy="0" r="6" fill="#f2c230" />
        <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(242, 194, 48, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="0" y1="0" x2="70" y2="-20" stroke="#7ad1e8" strokeWidth="2.5" />
        <circle cx="22" cy="-6" r="2.5" fill="#fff" />
        <circle cx="45" cy="-13" r="2.5" fill="#fff" />
        <circle cx="68" cy="-19" r="3" fill="#f2c230" />
        {/* Fine mist cones from pivot */}
        <path d="M 22 -6 L 16 12 L 28 12 Z" fill="rgba(122, 209, 232, 0.22)" />
        <path d="M 45 -13 L 38 7 L 52 7 Z" fill="rgba(122, 209, 232, 0.22)" />
        <path d="M 68 -19 L 60 2 L 76 2 Z" fill="rgba(122, 209, 232, 0.25)" />
      </g>

      {/* ====================================================
          4. FARM ROADS & SERVICE CONNECTIVITY
          ==================================================== */}
      {/* Primary Farm Arterial Track */}
      <path
        d="M 215 230 C 230 300 340 425 410 440 C 560 470 700 430 840 450 C 970 470 1060 520 1200 535 L 1200 555 C 1050 540 960 490 830 470 C 690 450 550 490 400 460 C 330 445 210 320 195 230 Z"
        fill="url(#pathGrad)"
      />
      {/* Branch road to Drone Launchpad (Top Right) */}
      <path
        d="M 680 445 C 720 380 780 320 860 270 L 878 280 C 800 330 740 390 705 450 Z"
        fill="url(#pathGrad)"
      />
      {/* Branch road to Quotation / Logistics Hub (Bottom Right) */}
      <path
        d="M 850 460 C 900 520 950 570 1010 610 L 995 625 C 935 580 885 530 835 470 Z"
        fill="url(#pathGrad)"
      />
      {/* Branch road to Advisory Pavilion (Bottom Left) */}
      <path
        d="M 370 435 C 310 470 260 510 220 555 L 205 545 C 245 498 298 458 355 425 Z"
        fill="url(#pathGrad)"
      />

      {/* Orchard & Tree Groves */}
      <g className="farm-orchard-trees">
        {[
          [100, 480], [140, 470], [180, 460],
          [90, 520], [130, 510], [170, 500],
          [80, 560], [120, 550], [160, 540],
          [70, 600], [110, 590], [150, 580],
          // Perimeter windbreak trees
          [680, 240], [710, 248], [740, 256],
          [760, 360], [775, 390], [790, 420],
          [1120, 390], [1150, 410], [1180, 430]
        ].map(([cx, cy], idx) => (
          <g key={idx} transform={`translate(${cx}, ${cy})`}>
            {/* Tree shadow */}
            <ellipse cx="2" cy="7" rx="9" ry="4" fill="rgba(0,0,0,0.3)" />
            {/* Tree canopy */}
            <circle cx="0" cy="0" r="8" className="farm-canopy" fill="#2d5e35" stroke="#1d3f23" strokeWidth="1" />
            <circle cx="-2" cy="-2" r="4" fill="rgba(242, 194, 48, 0.25)" />
          </g>
        ))}
      </g>

      {/* ====================================================
          5. LANDMARK INFRASTRUCTURE GRAPHICS
          ==================================================== */}

      {/* ----------------------------------------------------
          LANDMARK 01: DRONE FLEET (LAUNCHPAD & HANGAR)
          Coords around (924, 163) [77%, 24%]
          ---------------------------------------------------- */}
      <g
        className={`farm-landmark-group landmark-drones ${isHighlighted('drones') ? 'is-highlighted' : ''}`}
        onClick={() => onLandmarkSelect?.('drones')}
        style={{ cursor: 'pointer' }}
      >
        {/* Ground beacon highlight */}
        {isHighlighted('drones') && (
          <ellipse cx="924" cy="163" rx="75" ry="38" fill="rgba(242, 194, 48, 0.28)" filter="url(#beaconGlow)" />
        )}

        {/* Modular Drone Operations Hangar */}
        <g transform="translate(940, 110)">
          {/* Building base shadow */}
          <rect x="-35" y="15" width="70" height="24" rx="2" fill="rgba(0,0,0,0.35)" />
          {/* Building structure */}
          <path d="M -30 20 L 0 5 L 30 20 L 30 35 L -30 35 Z" fill="#252b27" stroke="#3d4740" strokeWidth="1.5" />
          {/* Roof Solar Panels */}
          <path d="M -26 19 L 0 6 L 26 19" stroke="#7ad1e8" strokeWidth="2.5" opacity="0.8" />
          {/* Hangar Bay Door */}
          <rect x="-16" y="24" width="32" height="11" fill="#141815" stroke="#f2c230" strokeWidth="1" />
          <line x1="0" y1="24" x2="0" y2="35" stroke="#f2c230" strokeWidth="0.8" />
        </g>

        {/* Primary Helipad Launchpad */}
        <g transform="translate(915, 163)">
          {/* Pad surface */}
          <ellipse cx="0" cy="0" rx="36" ry="18" fill="#222824" stroke="#f2c230" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="28" ry="14" fill="#1a1e1b" stroke="rgba(242, 194, 48, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
          {/* Landing "H" Marker */}
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fill="#f2c230"
            fontSize="14"
            fontWeight="bold"
            fontFamily="Space Grotesk, sans-serif"
          >
            H
          </text>
          {/* Pad Perimeter Lights */}
          {[-32, 0, 32].map((px, idx) => (
            <circle key={idx} cx={px} cy={idx === 1 ? -16 : 0} r="2" fill="#f2c230" />
          ))}
        </g>

        {/* Secondary Drone Pad */}
        <g transform="translate(865, 185)">
          <ellipse cx="0" cy="0" rx="22" ry="11" fill="#222824" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">H</text>
        </g>

        {/* Windsock Mast */}
        <g transform="translate(970, 155)">
          <line x1="0" y1="0" x2="0" y2="-28" stroke="#ccc" strokeWidth="1.5" />
          {/* Windsock orange-white stripes */}
          <path d="M 0 -26 L 16 -23 L 14 -18 L 0 -21 Z" fill="#f27d30" />
          <path d="M 5 -25 L 10 -24 L 9 -20 L 5 -21 Z" fill="#ffffff" />
        </g>

        {/* Parked agricultural multi-rotor on launchpad */}
        <g transform="translate(865, 180) scale(0.65)">
          <ellipse cx="0" cy="0" rx="10" ry="5" fill="#f2c230" />
          <line x1="-14" y1="-8" x2="14" y2="8" stroke="#333" strokeWidth="2" />
          <line x1="-14" y1="8" x2="14" y2="-8" stroke="#333" strokeWidth="2" />
          <circle cx="-14" cy="-8" r="5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <circle cx="14" cy="8" r="5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <circle cx="-14" cy="8" r="5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <circle cx="14" cy="-8" r="5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        </g>
      </g>

      {/* Flight Path Telemetry Line connecting Launchpad to Hovering Drone */}
      <path
        d="M 865 175 C 750 170 650 210 520 270"
        stroke="#f2c230"
        strokeWidth="1.8"
        strokeDasharray="6 6"
        opacity={isHighlighted('drones') || isHighlighted('spraying') ? 0.9 : 0.45}
      />

      {/* ----------------------------------------------------
          LANDMARK 02: PRECISION SPRAYING (DRONE IN FLIGHT)
          Coords around (504, 285) [42%, 42%]
          ---------------------------------------------------- */}
      <g
        className={`farm-landmark-group landmark-spraying ${isHighlighted('spraying') ? 'is-highlighted' : ''}`}
        onClick={() => onLandmarkSelect?.('spraying')}
        style={{ cursor: 'pointer' }}
      >
        {/* Ground beacon highlight under spray cone */}
        {isHighlighted('spraying') && (
          <ellipse cx="504" cy="355" rx="65" ry="28" fill="rgba(122, 209, 232, 0.35)" filter="url(#beaconGlow)" />
        )}

        {/* Drone Ground Shadow */}
        <ellipse cx="504" cy="355" rx="36" ry="12" fill="rgba(0, 0, 0, 0.45)" filter="url(#droneShadowFilter)" />

        {/* Conical Precision Spray Mist Emitted onto Field */}
        <polygon
          points="480,295 440,355 568,355 528,295"
          fill="url(#sprayMistGrad)"
        />
        {/* Spray Droplets & Micro-Particles */}
        <g opacity="0.8">
          <circle cx="488" cy="315" r="1.5" fill="#a4edff" />
          <circle cx="518" cy="322" r="1.8" fill="#a4edff" />
          <circle cx="465" cy="338" r="1.4" fill="#a4edff" />
          <circle cx="542" cy="342" r="1.6" fill="#a4edff" />
          <circle cx="504" cy="348" r="2.0" fill="#ffffff" />
        </g>

        {/* Hovering Agricultural Drone Structure */}
        <g transform="translate(504, 275)">
          {/* Carbon Fiber Rotor Arms */}
          <line x1="-36" y1="-14" x2="36" y2="14" stroke="#1c201d" strokeWidth="4" strokeLinecap="round" />
          <line x1="-36" y1="14" x2="36" y2="-14" stroke="#1c201d" strokeWidth="4" strokeLinecap="round" />
          <line x1="-42" y1="0" x2="42" y2="0" stroke="#1c201d" strokeWidth="4" strokeLinecap="round" />

          {/* Liquid Payload Spray Tank */}
          <rect x="-14" y="-7" width="28" height="15" rx="5" fill="#f2c230" stroke="#997500" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fill="#000" fontSize="7" fontWeight="800" fontFamily="DM Mono, monospace">
            AMULYA
          </text>

          {/* Central Avionics Hub & GNSS Antenna */}
          <ellipse cx="0" cy="-6" rx="9" ry="5" fill="#2d332e" stroke="#f2c230" strokeWidth="1" />
          <circle cx="0" cy="-9" r="3" fill="#f2c230" />
          <line x1="0" y1="-9" x2="0" y2="-16" stroke="#fff" strokeWidth="1.2" />
          <circle cx="0" cy="-16" r="1.5" fill="#38ef7d" />

          {/* Under-fuselage Spray Booms */}
          <line x1="-28" y1="11" x2="28" y2="11" stroke="#444a45" strokeWidth="2.5" />
          <circle cx="-24" cy="12" r="2.5" fill="#7ad1e8" />
          <circle cx="24" cy="12" r="2.5" fill="#7ad1e8" />

          {/* Spinning Propeller Blur Discs */}
          {[-36, -42, -36, 36, 42, 36].map((px, idx) => {
            const py = [-14, 0, 14, -14, 0, 14][idx];
            return (
              <g key={idx} transform={`translate(${px}, ${py})`}>
                <ellipse cx="0" cy="0" rx="14" ry="5" fill="rgba(255, 255, 255, 0.22)" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
                <circle cx="0" cy="0" r="2.5" fill="#f2c230" />
                {/* Motor Status LED */}
                <circle cx="0" cy="2" r="1.2" fill={idx % 2 === 0 ? '#38ef7d' : '#ff4b4b'} />
              </g>
            );
          })}
        </g>
      </g>

      {/* ----------------------------------------------------
          LANDMARK 03: FIELD OPERATIONS (SMART MONITORING & TELEMETRY)
          Coords around (792, 421) [66%, 62%]
          ---------------------------------------------------- */}
      <g
        className={`farm-landmark-group landmark-fieldOps ${isHighlighted('fieldOps') ? 'is-highlighted' : ''}`}
        onClick={() => onLandmarkSelect?.('fieldOps')}
        style={{ cursor: 'pointer' }}
      >
        {/* Ground beacon highlight */}
        {isHighlighted('fieldOps') && (
          <ellipse cx="792" cy="421" rx="65" ry="32" fill="rgba(242, 194, 48, 0.28)" filter="url(#beaconGlow)" />
        )}

        {/* Telemetry Mast Tower */}
        <g transform="translate(800, 395)">
          {/* Concrete Footing */}
          <ellipse cx="0" cy="26" rx="14" ry="6" fill="#303531" stroke="#454c46" strokeWidth="1" />
          {/* Lattice Mast */}
          <line x1="-6" y1="26" x2="0" y2="-45" stroke="#9da69f" strokeWidth="2" />
          <line x1="6" y1="26" x2="0" y2="-45" stroke="#9da69f" strokeWidth="2" />
          <line x1="-5" y1="12" x2="5" y2="12" stroke="#9da69f" strokeWidth="1" />
          <line x1="-3" y1="-8" x2="3" y2="-8" stroke="#9da69f" strokeWidth="1" />
          <line x1="-2" y1="-26" x2="2" y2="-26" stroke="#9da69f" strokeWidth="1" />

          {/* Cross Bracing */}
          <line x1="-6" y1="26" x2="3" y2="-8" stroke="#9da69f" strokeWidth="0.8" opacity="0.6" />
          <line x1="6" y1="26" x2="-3" y2="-8" stroke="#9da69f" strokeWidth="0.8" opacity="0.6" />

          {/* Anemometer & Weather Sensor */}
          <circle cx="0" cy="-45" r="3" fill="#f2c230" />
          <line x1="-7" y1="-45" x2="7" y2="-45" stroke="#f2c230" strokeWidth="1.2" />
          <circle cx="-7" cy="-47" r="2" fill="#fff" />
          <circle cx="7" cy="-43" r="2" fill="#fff" />

          {/* Solar Power Unit on Pole */}
          <rect x="-10" y="-2" width="20" height="10" rx="1" fill="#1d3f54" stroke="#7ad1e8" strokeWidth="1" transform="rotate(-15)" />

          {/* Satellite / RTK Telemetry Dish */}
          <ellipse cx="8" cy="-22" rx="7" ry="11" fill="#444b45" stroke="#f2c230" strokeWidth="1" />
          <line x1="8" y1="-22" x2="16" y2="-24" stroke="#fff" strokeWidth="1.2" />

          {/* Radiating Telemetry Waves */}
          <path d="M 18 -32 A 16 16 0 0 1 24 -14" fill="none" stroke="#f2c230" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M 23 -37 A 24 24 0 0 1 31 -10" fill="none" stroke="#f2c230" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* Mobile Field Operations Command Vehicle */}
        <g transform="translate(755, 425)">
          <ellipse cx="0" cy="12" rx="20" ry="7" fill="rgba(0,0,0,0.3)" />
          {/* Vehicle Body */}
          <rect x="-16" y="-4" width="32" height="14" rx="3" fill="#2d352f" stroke="#f2c230" strokeWidth="1.2" />
          {/* Cab Window */}
          <path d="M 4 -2 L 13 -2 L 14 4 L 4 4 Z" fill="#7ad1e8" opacity="0.7" />
          {/* Wheels */}
          <circle cx="-9" cy="10" r="4.5" fill="#111" stroke="#666" strokeWidth="1" />
          <circle cx="9" cy="10" r="4.5" fill="#111" stroke="#666" strokeWidth="1" />
          {/* Roof Battery Rack */}
          <rect x="-14" y="-8" width="16" height="4" fill="#f2c230" />
        </g>
      </g>

      {/* ----------------------------------------------------
          LANDMARK 04: SUBSIDY GUIDANCE (FARMER ADVISORY PAVILION)
          Coords around (252, 462) [21%, 68%]
          ---------------------------------------------------- */}
      <g
        className={`farm-landmark-group landmark-subsidy ${isHighlighted('subsidy') ? 'is-highlighted' : ''}`}
        onClick={() => onLandmarkSelect?.('subsidy')}
        style={{ cursor: 'pointer' }}
      >
        {/* Ground beacon highlight */}
        {isHighlighted('subsidy') && (
          <ellipse cx="252" cy="462" rx="70" ry="32" fill="rgba(242, 194, 48, 0.28)" filter="url(#beaconGlow)" />
        )}

        {/* Modern Sustainable Farm Pavilion */}
        <g transform="translate(252, 440)">
          {/* Foundation Slab */}
          <polygon points="-36,18 0,4 36,18 0,32" fill="#323833" stroke="#485049" strokeWidth="1" />

          {/* Pavilion Pillars */}
          <line x1="-28" y1="15" x2="-28" y2="-8" stroke="#bda55d" strokeWidth="2.5" />
          <line x1="28" y1="15" x2="28" y2="-8" stroke="#bda55d" strokeWidth="2.5" />
          <line x1="0" y1="28" x2="0" y2="6" stroke="#bda55d" strokeWidth="2.5" />

          {/* Timber Pergola Roof / Solar Canopy */}
          <polygon points="-38,-8 0,-24 38,-8 0,8" fill="#242c26" stroke="#f2c230" strokeWidth="1.5" />
          <line x1="-38" y1="-8" x2="0" y2="8" stroke="#f2c230" strokeWidth="1" />
          <line x1="38" y1="-8" x2="0" y2="8" stroke="#f2c230" strokeWidth="1" />
          <line x1="0" y1="-24" x2="0" y2="8" stroke="#f2c230" strokeWidth="1.2" />

          {/* Roof Solar Panels */}
          <polygon points="-28,-10 0,-21 28,-10 0,1" fill="#1b3b4f" stroke="#7ad1e8" strokeWidth="1" opacity="0.8" />

          {/* Advisory Notice Board Plaque */}
          <rect x="-14" y="8" width="10" height="12" rx="1" fill="#f2c230" stroke="#7c6000" strokeWidth="0.8" />
          <line x1="-12" y1="11" x2="-6" y2="11" stroke="#000" strokeWidth="1" />
          <line x1="-12" y1="14" x2="-7" y2="14" stroke="#000" strokeWidth="1" />
          <line x1="-12" y1="17" x2="-8" y2="17" stroke="#000" strokeWidth="1" />

          {/* Certified Emblem on Pavilion (Shield Outline) */}
          <path d="M 6 8 L 14 8 L 14 14 C 14 18 10 20 10 20 C 10 20 6 18 6 14 Z" fill="#2d5e35" stroke="#f2c230" strokeWidth="1" />
        </g>
      </g>

      {/* ----------------------------------------------------
          LANDMARK 05: FARM GALLERY (PANORAMIC OVERLOOK & FIELD VISTA)
          Coords around (192, 190) [16%, 28%]
          ---------------------------------------------------- */}
      <g
        className={`farm-landmark-group landmark-gallery ${isHighlighted('gallery') ? 'is-highlighted' : ''}`}
        onClick={() => onLandmarkSelect?.('gallery')}
        style={{ cursor: 'pointer' }}
      >
        {/* Ground beacon highlight */}
        {isHighlighted('gallery') && (
          <ellipse cx="192" cy="190" rx="60" ry="30" fill="rgba(242, 194, 48, 0.28)" filter="url(#beaconGlow)" />
        )}

        {/* Elevated Timber Observation Deck */}
        <g transform="translate(192, 180)">
          {/* Deck Piles into Hillside */}
          <line x1="-22" y1="10" x2="-22" y2="28" stroke="#685536" strokeWidth="2.5" />
          <line x1="22" y1="10" x2="22" y2="28" stroke="#685536" strokeWidth="2.5" />
          <line x1="0" y1="14" x2="0" y2="34" stroke="#685536" strokeWidth="2.5" />

          {/* Wooden Decking Platform */}
          <polygon points="-28,8 0,-2 28,8 0,18" fill="#4d3e28" stroke="#755e3c" strokeWidth="1.2" />

          {/* Safety Handrail */}
          <path d="M -26 3 L 0 -7 L 26 3" stroke="#bda55d" strokeWidth="1.8" fill="none" />
          <line x1="-26" y1="7" x2="-26" y2="3" stroke="#bda55d" strokeWidth="1.5" />
          <line x1="0" y1="-3" x2="0" y2="-7" stroke="#bda55d" strokeWidth="1.5" />
          <line x1="26" y1="7" x2="26" y2="3" stroke="#bda55d" strokeWidth="1.5" />

          {/* Field Viewfinder / Telescope on Deck */}
          <circle cx="8" cy="-5" r="2.5" fill="#f2c230" />
          <line x1="8" y1="-5" x2="16" y2="-12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="-3" x2="8" y2="4" stroke="#aaa" strokeWidth="1.5" />

          {/* Scenic Camera Icon Badge */}
          <rect x="-14" y="-14" width="12" height="9" rx="1.5" fill="#f2c230" stroke="#000" strokeWidth="0.8" />
          <circle cx="-8" cy="-9.5" r="2" fill="#000" />
        </g>
      </g>

      {/* ----------------------------------------------------
          LANDMARK 06: REQUEST A QUOTATION (COMMERCIAL & DISPATCH HUB)
          Coords around (1032, 503) [86%, 74%]
          ---------------------------------------------------- */}
      <g
        className={`farm-landmark-group landmark-quotation ${isHighlighted('quotation') ? 'is-highlighted' : ''}`}
        onClick={() => onLandmarkSelect?.('quotation')}
        style={{ cursor: 'pointer' }}
      >
        {/* Ground beacon highlight */}
        {isHighlighted('quotation') && (
          <ellipse cx="1032" cy="503" rx="72" ry="34" fill="rgba(242, 194, 48, 0.28)" filter="url(#beaconGlow)" />
        )}

        {/* Commercial Operations Building */}
        <g transform="translate(1040, 470)">
          {/* Foundation */}
          <polygon points="-42,24 0,8 42,24 0,40" fill="#2d332f" stroke="#48524a" strokeWidth="1" />

          {/* Building Facade */}
          <polygon points="-38,20 0,6 38,20 38,-4 0,-18 -38,-4" fill="#202622" stroke="#3d4941" strokeWidth="1.2" />

          {/* Amulya Gold Roof Trim */}
          <path d="M -38 -4 L 0 -18 L 38 -4" stroke="#f2c230" strokeWidth="2.5" fill="none" />

          {/* Glass Office Frontage */}
          <polygon points="-24,18 0,9 24,18 24,6 0,-3 -24,6" fill="#1b414a" stroke="#7ad1e8" strokeWidth="1" opacity="0.85" />

          {/* Quotation Office Signboard */}
          <rect x="-16" y="-12" width="32" height="7" rx="1" fill="#f2c230" />
          <text x="0" y="-7" textAnchor="middle" fill="#000" fontSize="5.5" fontWeight="bold" fontFamily="DM Mono, monospace">
            AMULYA AGRO
          </text>
        </g>

        {/* Dispatch & Delivery Transport Van */}
        <g transform="translate(980, 505)">
          <ellipse cx="0" cy="14" rx="22" ry="7" fill="rgba(0,0,0,0.3)" />
          {/* Van Body */}
          <rect x="-18" y="-6" width="36" height="18" rx="3" fill="#ffffff" stroke="#222" strokeWidth="1" />
          {/* Amulya Gold Logo Decal on Van */}
          <rect x="-12" y="-1" width="16" height="6" fill="#f2c230" rx="1" />
          {/* Cab Window */}
          <path d="M 8 -4 L 16 -4 L 17 4 L 8 4 Z" fill="#7ad1e8" opacity="0.8" />
          {/* Wheels */}
          <circle cx="-10" cy="12" r="5" fill="#222" stroke="#666" strokeWidth="1" />
          <circle cx="10" cy="12" r="5" fill="#222" stroke="#666" strokeWidth="1" />
        </g>

        {/* Cargo Flight Cases / Drone Delivery Crates */}
        <g transform="translate(1015, 520)">
          <rect x="0" y="0" width="10" height="8" rx="1" fill="#3d443f" stroke="#f2c230" strokeWidth="0.8" />
          <rect x="12" y="2" width="12" height="7" rx="1" fill="#2d332f" stroke="#fff" strokeWidth="0.8" />
        </g>
      </g>
    </svg>
  );
};

