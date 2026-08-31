/**
 * Top-down Piper Tri-Pacer diagram — uses the user's own transparent-
 * background aircraft image, served as a plain static asset from the
 * project's public/ folder (same-origin, no external dependency), with
 * the loading-station zones overlaid on top.
 *
 * IMPORTANT: place tripacer-diagram.png directly in the project's
 * public/ folder (e.g. public/tripacer-diagram.png). This is a plain
 * runtime path, not a JS import — if the file is ever missing, only
 * the image fails to load (broken image icon), the site build itself
 * will never break because of it.
 */
const TRIPACER_IMG_PATH = "/tripacer-diagram.png";

export default function AircraftDiagram() {
  const CX = 224; // fuselage centerline (matches the source image's geometry)
  const mx = (x) => 2 * CX - x; // mirror an x coordinate about the centerline

  return (
    <svg viewBox="0 0 430 305" xmlns="http://www.w3.org/2000/svg" className="wbc-diagram-svg">
      {/* ===================== AIRCRAFT IMAGE ===================== */}
      <image href={TRIPACER_IMG_PATH} x="0" y="0" width="430" height="305" preserveAspectRatio="xMidYMid meet" />

      {/* ===================== FUNCTIONAL LOADING ZONES ===================== */}

      {/* Pilot / Co-Pilot — cabin, just ahead of the wing leading edge */}
      <rect x="206" y="66" width="16" height="24" fill="#ffb02e" fillOpacity="0.25" stroke="#ffb02e" strokeWidth="1.25" strokeDasharray="3 2" />
      <rect x="226" y="66" width="16" height="24" fill="#ffb02e" fillOpacity="0.25" stroke="#ffb02e" strokeWidth="1.25" strokeDasharray="3 2" />
      <line x1="120" y1="20" x2="208" y2="68" stroke="#ffb02e" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <line x1="328" y1="20" x2="240" y2="68" stroke="#ffb02e" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <text x="90" y="16" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">PILOT</text>
      <text x="358" y="16" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">CO-PILOT</text>

      {/* Rear Seat 1 / 2 — sit directly behind Pilot / Co-Pilot */}
      <rect x="206" y="95" width="16" height="26" fill="#5aa9ff" fillOpacity="0.22" stroke="#5aa9ff" strokeWidth="1.25" strokeDasharray="3 2" />
      <rect x="226" y="95" width="16" height="26" fill="#5aa9ff" fillOpacity="0.22" stroke="#5aa9ff" strokeWidth="1.25" strokeDasharray="3 2" />
      <line x1="120" y1="98" x2="204" y2="102" stroke="#5aa9ff" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <line x1="328" y1="98" x2="244" y2="102" stroke="#5aa9ff" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <text x="90" y="94" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">REAR SEAT 1</text>
      <text x="358" y="94" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">REAR SEAT 2</text>

      {/* Left / Right Tank — the wing-root box with the circle */}
      <rect x="166" y="63" width="35" height="39" fill="#3ecf6b" fillOpacity="0.18" stroke="#3ecf6b" strokeWidth="1.5" />
      <circle cx="184" cy="80" r="5" fill="none" stroke="#3ecf6b" strokeWidth="1.25" />
      <rect x={mx(201)} y="63" width="35" height="39" fill="#3ecf6b" fillOpacity="0.18" stroke="#3ecf6b" strokeWidth="1.5" />
      <circle cx={mx(184)} cy="80" r="5" fill="none" stroke="#3ecf6b" strokeWidth="1.25" />
      <text x="90" y="46" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">LEFT</text>
      <text x="90" y="58" textAnchor="middle" className="wbc-diagram-label-sub">TANK 18 GAL</text>
      <line x1="120" y1="52" x2="164" y2="70" stroke="#3ecf6b" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <text x="358" y="46" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">RIGHT</text>
      <text x="358" y="58" textAnchor="middle" className="wbc-diagram-label-sub">TANK 18 GAL</text>
      <line x1="328" y1="52" x2="284" y2="70" stroke="#3ecf6b" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />

      {/* Baggage — aft fuselage section between the rear seats and the tail */}
      <rect x="206" y="145" width="36" height="55" fill="#ff5a4e" fillOpacity="0.16" stroke="#ff5a4e" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="90" y="175" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">BAGGAGE</text>
      <text x="90" y="187" textAnchor="middle" className="wbc-diagram-label-sub">MAX 100 LBS</text>
      <line x1="120" y1="172" x2="204" y2="172" stroke="#ff5a4e" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />

      <text x={CX} y="298" textAnchor="middle" className="wbc-diagram-dim">N2610A &middot; TOP VIEW</text>
    </svg>
  );
}
