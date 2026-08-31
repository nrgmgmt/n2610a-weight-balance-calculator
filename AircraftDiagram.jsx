/**
 * Top-down Piper Tri-Pacer outline, hand-traced directly from the
 * reference drawing supplied by the user (canopy/cabin at top, wings
 * with rib lines and wing-root panel boxes, tapering fuselage, oval
 * tail with strut braces at the bottom) — traced AS-IS, no rotation
 * (the reference is already oriented cabin/front at top, tail at
 * bottom), and all dimension callouts removed.
 *
 * Functional loading-station zones are overlaid using the user's exact
 * mapping:
 *  - Pilot / Co-Pilot: cabin, just ahead of the wing leading edge
 *  - Left / Right Tank: the wing-root box that has a circle in it
 *  - Rear Seat 1 / 2: the ribbed sub-box directly inboard of each tank
 *  - Baggage: the tapering fuselage section between wing and tail
 */
export default function AircraftDiagram() {
  const CX = 224; // fuselage centerline

  // mirror helper: reflect an x coordinate about the fuselage centerline
  const mx = (x) => 2 * CX - x;

  return (
    <svg viewBox="0 0 430 305" xmlns="http://www.w3.org/2000/svg" className="wbc-diagram-svg">
      {/* ===================== TRACED AIRFRAME ===================== */}

      {/* canopy ring (small loop on top of the canopy) */}
      <ellipse cx={CX} cy="6" rx="7" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* dark cabin canopy (pilot/co-pilot sit just below/behind this) */}
      <path
        d={`M 204 20
            C 204 12, 214 8, ${CX} 8
            C 234 8, 244 12, 244 20
            L 244 55
            C 244 62, 236 66, ${CX} 66
            C 212 66, 204 62, 204 55 Z`}
        fill="currentColor" opacity="0.85"
      />

      {/* windshield struts: canopy base converging down to the wing */}
      <path d={`M 210 62 L ${CX} 90 L 238 62`} fill="none" stroke="currentColor" strokeWidth="1.25" />
      <line x1="216" y1="90" x2="214" y2="132" stroke="currentColor" strokeWidth="1.25" />
      <line x1="232" y1="90" x2="234" y2="132" stroke="currentColor" strokeWidth="1.25" />

      {/* wings: rounded-tip capsule spanning full width, both sides */}
      <path
        d="M 78 61
           L 350 61
           C 385 61, 406 66, 406 96
           C 406 126, 385 132, 350 132
           L 78 132
           C 43 132, 22 126, 22 96
           C 22 66, 43 61, 78 61 Z"
        fill="none" stroke="currentColor" strokeWidth="2"
      />
      {/* rib lines across both wings (skipping the boxed panel areas) */}
      {[38,58,78,98,118,138].map((x) => (
        <line key={"lrib"+x} x1={x} y1={65} x2={x} y2={128} stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      ))}
      {[310,330,350,370,390,410].map((x) => (
        <line key={"rrib"+x} x1={x} y1={65} x2={x} y2={128} stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      ))}
      {/* small wingtip nav-light rectangles */}
      <rect x="66" y="61" width="14" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x={mx(80)} y="61" width="14" height="8" fill="none" stroke="currentColor" strokeWidth="1" />

      {/* trailing-edge flap/aileron outline, both wings */}
      <rect x="68" y="117" width="108" height="12" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <rect x={mx(176)} y="117" width="108" height="12" fill="none" stroke="currentColor" strokeWidth="1.25" />

      {/* fuselage taper (wing root down to the tail) — the "baggage" section */}
      <path d={`M 214 132 L ${CX} 220 L 234 132`} fill="none" stroke="currentColor" strokeWidth="1.25" />
      <line x1={CX} y1="220" x2={CX} y2="271" stroke="currentColor" strokeWidth="1.25" />

      {/* tail: rounded oval horizontal stabilizer + strut braces */}
      <ellipse cx={CX} cy="245" rx="58" ry="26" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d={`M 166 232 L 166 250 L 196 250`} fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d={`M ${mx(166)} 232 L ${mx(166)} 250 L ${mx(196)} 250`} fill="none" stroke="currentColor" strokeWidth="1.25" />
      <line x1="196" y1="250" x2={CX} y2="271" stroke="currentColor" strokeWidth="1.25" />
      <line x1={mx(196)} y1="250" x2={CX} y2="271" stroke="currentColor" strokeWidth="1.25" />

      {/* ===================== FUNCTIONAL LOADING ZONES ===================== */}

      {/* Pilot / Co-Pilot — cabin, just ahead of the wing leading edge */}
      <rect x="206" y="66" width="16" height="24" fill="#ffb02e" fillOpacity="0.25" stroke="#ffb02e" strokeWidth="1.25" strokeDasharray="3 2" />
      <rect x="226" y="66" width="16" height="24" fill="#ffb02e" fillOpacity="0.25" stroke="#ffb02e" strokeWidth="1.25" strokeDasharray="3 2" />
      <line x1="120" y1="20" x2="208" y2="68" stroke="#ffb02e" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <line x1="328" y1="20" x2="240" y2="68" stroke="#ffb02e" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <text x="90" y="16" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">PILOT</text>
      <text x="358" y="16" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">CO-PILOT</text>

      {/* Left / Right Tank — the wing-root box with the circle */}
      <rect x="166" y="63" width="35" height="39" fill="#3ecf6b" fillOpacity="0.18" stroke="#3ecf6b" strokeWidth="1.5" />
      <circle cx="184" cy="80" r="5" fill="none" stroke="#3ecf6b" strokeWidth="1.25" />
      <rect x={mx(201)} y="63" width="35" height="39" fill="#3ecf6b" fillOpacity="0.18" stroke="#3ecf6b" strokeWidth="1.5" />
      <circle cx={mx(184)} cy="80" r="5" fill="none" stroke="#3ecf6b" strokeWidth="1.25" />
      <text x="90" y="76" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">LEFT</text>
      <text x="90" y="88" textAnchor="middle" className="wbc-diagram-label-sub">TANK 18 GAL</text>
      <line x1="120" y1="80" x2="164" y2="80" stroke="#3ecf6b" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <text x="358" y="76" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">RIGHT</text>
      <text x="358" y="88" textAnchor="middle" className="wbc-diagram-label-sub">TANK 18 GAL</text>
      <line x1="328" y1="80" x2="284" y2="80" stroke="#3ecf6b" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />

      {/* Rear Seat 1 / 2 — the ribbed sub-box directly below each tank */}
      <rect x="166" y="102" width="35" height="28" fill="#5aa9ff" fillOpacity="0.18" stroke="#5aa9ff" strokeWidth="1.5" />
      {[175,184,193].map((x)=>(<line key={"l"+x} x1={x} y1="104" x2={x} y2="128" stroke="#5aa9ff" strokeWidth="0.5" opacity="0.7" />))}
      <rect x={mx(201)} y="102" width="35" height="28" fill="#5aa9ff" fillOpacity="0.18" stroke="#5aa9ff" strokeWidth="1.5" />
      {[255,264,273].map((x)=>(<line key={"r"+x} x1={x} y1="104" x2={x} y2="128" stroke="#5aa9ff" strokeWidth="0.5" opacity="0.7" />))}
      <text x="90" y="112" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">REAR SEAT 1</text>
      <line x1="120" y1="116" x2="164" y2="116" stroke="#5aa9ff" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      <text x="358" y="112" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">REAR SEAT 2</text>
      <line x1="328" y1="116" x2="284" y2="116" stroke="#5aa9ff" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />

      {/* Baggage — the tapering fuselage section between wing and tail */}
      <rect x="206" y="145" width="36" height="55" fill="#ff5a4e" fillOpacity="0.16" stroke="#ff5a4e" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="90" y="175" textAnchor="middle" className="wbc-diagram-label wbc-diagram-label-sm">BAGGAGE</text>
      <text x="90" y="187" textAnchor="middle" className="wbc-diagram-label-sub">MAX 100 LBS</text>
      <line x1="120" y1="172" x2="204" y2="172" stroke="#ff5a4e" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />

      <text x={CX} y="298" textAnchor="middle" className="wbc-diagram-dim">N2610A &middot; TOP VIEW</text>
    </svg>
  );
}
