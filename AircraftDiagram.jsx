/**
 * Top-down Piper Tri-Pacer outline, hand-traced as a vector clone of the
 * reference drawing the user supplied (rounded twin-lobe tail, ribbed
 * wing panels, tapered dark nose cone) — all dimension callouts/text
 * removed, and the whole airframe rotated 180° so the nose/prop cone
 * sits at the TOP of the canvas.
 *
 * The traced shapes live inside <g id="airframe"> in the SAME
 * orientation as the source photo (cone at bottom); a single
 * `transform="rotate(180 ...)"` on that group flips the whole drawing
 * so the cone ends up at top, exactly as requested — nothing about the
 * individual paths needed to change, only the group transform.
 */
export default function AircraftDiagram() {
  const CX = 260, CY = 330; // rotation center = canvas center

  return (
    <svg viewBox="0 0 520 660" xmlns="http://www.w3.org/2000/svg" className="wbc-diagram-svg">
      <g id="airframe" transform={`rotate(180 ${CX} ${CY})`}>
        {/* ===== traced in the SAME orientation as the reference photo ===== */}

        {/* twin-lobe tail (horizontal stabilizer), smooth rounded petals
             meeting at a point at top, matching the reference photo */}
        <path
          d="M 260 38
             Q 150 55 108 104
             Q 150 130 236 122
             Q 230 150 176 168
             Q 225 190 260 178
             Q 295 190 344 168
             Q 290 150 284 122
             Q 370 130 412 104
             Q 370 55 260 38 Z"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"
        />
        {/* elevator hinge line across both lobes */}
        <path d="M 176 132 L 344 132" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />

        {/* vertical fin sliver (top view of rudder) running down the centerline */}
        <path d="M 260 150 L 252 300 L 268 300 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />

        {/* ribbed stabilizer / wing surface, rounded tip caps, aft of the fin */}
        <path
          d="M 40 260
             C 40 244, 55 236, 75 236
             L 200 232 L 320 232 L 445 236
             C 465 236, 480 244, 480 260
             L 480 300
             C 480 316, 465 324, 445 324
             L 320 328 L 200 328 L 75 324
             C 55 324, 40 316, 40 300 Z"
          fill="none" stroke="currentColor" strokeWidth="2"
        />
        {/* rib lines */}
        {[70,95,120,145,170].map((x) => (
          <line key={"lrib"+x} x1={x} y1={244} x2={x} y2={316} stroke="currentColor" strokeWidth="0.75" opacity="0.55" />
        ))}
        {[350,375,400,425,450].map((x) => (
          <line key={"rrib"+x} x1={x} y1={244} x2={x} y2={316} stroke="currentColor" strokeWidth="0.75" opacity="0.55" />
        ))}
        {/* window/panel cutouts + wheel-well circles, mirrored */}
        <rect x="95" y="240" width="90" height="16" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <rect x="335" y="240" width="90" height="16" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="210" cy="292" r="6" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="310" cy="292" r="6" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <rect x="452" y="306" width="14" height="10" fill="none" stroke="currentColor" strokeWidth="1" />

        {/* tapered fuselage neck connecting ribbed panel to the nose cone */}
        <path d="M 235 328 L 225 375 L 295 375 L 285 328 Z" fill="none" stroke="currentColor" strokeWidth="2" />

        {/* dark tapered nose cone ("propeller"/spinner per reference) */}
        <path
          d="M 222 378 L 298 378 L 288 430 C 286 448, 274 456, 260 458
             C 246 456, 234 448, 232 430 Z"
          fill="currentColor" opacity="0.85"
        />
        <line x1="260" y1="378" x2="260" y2="455" stroke="#0b0e11" strokeWidth="1" opacity="0.5" />
        {/* small wheel arc beneath the cone */}
        <path d="M 246 458 C 246 470, 274 470, 274 458" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* ---------- functional labeled zones (added ON TOP of the traced
           airframe, positioned to match it post-rotation: nose/cone now at
           top, wings in the middle, tail lobe at bottom) ---------- */}

      {/* Pilot / Co-Pilot — sit on the traced fuselage neck between the
          nose cone and the wing panel */}
      <rect x="228" y="215" width="28" height="40" fill="#ffb02e" fillOpacity="0.2" stroke="#ffb02e" strokeWidth="1.5" strokeDasharray="4 3" rx="5" />
      <rect x="264" y="215" width="28" height="40" fill="#ffb02e" fillOpacity="0.2" stroke="#ffb02e" strokeWidth="1.5" strokeDasharray="4 3" rx="5" />
      <line x1="150" y1="120" x2="230" y2="220" stroke="#ffb02e" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
      <line x1="370" y1="120" x2="290" y2="220" stroke="#ffb02e" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
      <text x="120" y="115" textAnchor="middle" className="wbc-diagram-label">PILOT</text>
      <text x="400" y="115" textAnchor="middle" className="wbc-diagram-label">CO-PILOT</text>

      {/* Left / Right tank — over the ribbed wing panel */}
      <rect x="55" y="330" width="150" height="42" fill="#3ecf6b" fillOpacity="0.14" stroke="#3ecf6b" strokeWidth="1.5" strokeDasharray="5 3" rx="6" />
      <rect x="315" y="330" width="150" height="42" fill="#3ecf6b" fillOpacity="0.14" stroke="#3ecf6b" strokeWidth="1.5" strokeDasharray="5 3" rx="6" />
      <text x="130" y="348" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">LEFT TANK</text>
      <text x="130" y="362" textAnchor="middle" className="wbc-diagram-label-sub">18 GAL MAX</text>
      <text x="390" y="348" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">RIGHT TANK</text>
      <text x="390" y="362" textAnchor="middle" className="wbc-diagram-label-sub">18 GAL MAX</text>

      {/* Rear Seat 1 / 2 */}
      <rect x="228" y="405" width="28" height="34" fill="#5aa9ff" fillOpacity="0.2" stroke="#5aa9ff" strokeWidth="1.5" strokeDasharray="4 3" rx="5" />
      <rect x="264" y="405" width="28" height="34" fill="#5aa9ff" fillOpacity="0.2" stroke="#5aa9ff" strokeWidth="1.5" strokeDasharray="4 3" rx="5" />
      <line x1="120" y1="420" x2="226" y2="420" stroke="#5aa9ff" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
      <line x1="400" y1="420" x2="294" y2="420" stroke="#5aa9ff" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
      <text x="70" y="424" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">REAR SEAT 1</text>
      <text x="450" y="424" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">REAR SEAT 2</text>

      {/* Baggage */}
      <rect x="232" y="452" width="56" height="34" fill="#ff5a4e" fillOpacity="0.16" stroke="#ff5a4e" strokeWidth="1.5" strokeDasharray="4 3" rx="6" />
      <line x1="120" y1="469" x2="230" y2="469" stroke="#ff5a4e" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
      <text x="70" y="465" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">BAGGAGE</text>
      <text x="70" y="479" textAnchor="middle" className="wbc-diagram-label-sub">MAX 100 LBS</text>

      <text x="260" y="18" textAnchor="middle" className="wbc-diagram-dim">N2610A &middot; TOP VIEW</text>
    </svg>
  );
}
