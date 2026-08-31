import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import AircraftDiagram from "./AircraftDiagram";

/**
 * Piper PA-22/135 Tri-Pacer (N2610A) Weight & Balance Calculator
 * Self-contained React component — no external CSS/JS dependencies
 * besides AircraftDiagram.jsx (also provided, same folder).
 * Drop both files into your project (e.g. src/components/) and render
 * <WeightBalanceCalculator /> on any page/route.
 */

const ARMS = {
  pilot: 81.0,
  copilot: 81.0,
  leftTank: 84.0,
  rightTank: 84.0,
  rear1: 109.0,
  rear2: 109.0,
  baggage: 127.0,
};
const EMPTY = { weight: 1138.0, arm: 70.87, moment: 80643.0 };
const MAX_GROSS = 1950;
const MAX_TANK_GAL = 18; // per side, 36 total
const MAX_BAGGAGE = 100;

// Envelope polygon in (cg, weight) space
const ENVELOPE = [
  [70, 1100],
  [70, 1380],
  [77.5, 1950],
  [84, 1950],
  [84, 1100],
];

function pointInPolygon(pt, poly) {
  let x = pt[0],
    y = pt[1],
    inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0],
      yi = poly[i][1],
      xj = poly[j][0],
      yj = poly[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function fmt(n, d) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function EnvelopeChart({ cg, weight, ok, idSuffix = "" }) {
  const W = 640,
    H = 460,
    padL = 56,
    padR = 20,
    padT = 24,
    padB = 44;
  const cgMin = 68,
    cgMax = 86,
    wMin = 1000,
    wMax = 2000;
  const px = (c) => padL + ((c - cgMin) / (cgMax - cgMin)) * (W - padL - padR);
  const py = (w) => H - padB - ((w - wMin) / (wMax - wMin)) * (H - padT - padB);

  const cgLines = [];
  for (let c = cgMin; c <= cgMax; c += 2) cgLines.push(c);
  const wLines = [];
  for (let w = wMin; w <= wMax; w += 200) wLines.push(w);

  const envelopePts = ENVELOPE.map((p) => `${px(p[0])},${py(p[1])}`).join(" ");
  const showPoint = isFinite(cg) && weight > 0;
  const cx = px(Math.max(cgMin, Math.min(cgMax, cg)));
  const cy = py(Math.max(wMin, Math.min(wMax, weight)));
  const dotColor = ok ? "#3ecf6b" : "#ff5a4e";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {cgLines.map((c) => (
        <g key={"cg" + idSuffix + c}>
          <line x1={px(c)} y1={padT} x2={px(c)} y2={H - padB} stroke="#2c353c" strokeWidth="1" />
          <text x={px(c)} y={H - padB + 18} fontSize="11" fill="#9fb0bb" textAnchor="middle" fontFamily="monospace">
            {c}
          </text>
        </g>
      ))}
      {wLines.map((w) => (
        <g key={"w" + idSuffix + w}>
          <line x1={padL} y1={py(w)} x2={W - padR} y2={py(w)} stroke="#2c353c" strokeWidth="1" />
          <text x={padL - 8} y={py(w) + 4} fontSize="11" fill="#9fb0bb" textAnchor="end" fontFamily="monospace">
            {w}
          </text>
        </g>
      ))}
      <text x={(padL + W - padR) / 2} y={H - 6} fontSize="12" fill="#9fb0bb" textAnchor="middle">
        Center of Gravity (in aft of datum)
      </text>
      <text
        x="14"
        y={(padT + H - padB) / 2}
        fontSize="12"
        fill="#9fb0bb"
        textAnchor="middle"
        transform={`rotate(-90 14 ${(padT + H - padB) / 2})`}
      >
        Weight (lbs)
      </text>
      <polygon points={envelopePts} fill="rgba(255,176,46,0.12)" stroke="#ffb02e" strokeWidth="2.5" />
      <line
        x1={padL}
        y1={py(1950)}
        x2={W - padR}
        y2={py(1950)}
        stroke="#ff5a4e"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      <text x={padL + 6} y={py(1950) - 6} fontSize="11" fill="#ff5a4e">
        MAX GROSS WEIGHT: 1950 LBS
      </text>
      {showPoint && (
        <>
          <circle cx={cx} cy={cy} r="7" fill={dotColor} stroke="#0b0e11" strokeWidth="2" />
          <text x={cx} y={cy - 12} fontSize="12" fill={dotColor} textAnchor="middle" fontWeight="700">
            {cg.toFixed(2)} in / {Math.round(weight)} lbs
          </text>
        </>
      )}
    </svg>
  );
}

function WeightField({ label, value, onChange, id }) {
  return (
    <div className="wbc-wfield">
      <label htmlFor={id}>{label}</label>
      <div className="wbc-wfield-input">
        <input
          id={id}
          className="wbc-num"
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
        />
        <span className="wbc-wfield-unit">lbs</span>
      </div>
    </div>
  );
}

function TankSlider({ label, gal, onChange, id }) {
  const w = Math.min(MAX_TANK_GAL, Math.max(0, gal || 0)) * 6;
  return (
    <div className="wbc-tank">
      <div className="wbc-tank-head">
        <label htmlFor={id}>{label}</label>
        <span className="wbc-tank-readout">
          {fmt(gal || 0, 1)} gal <span className="wbc-tank-arrow">&rarr;</span> {fmt(w, 0)} lbs
        </span>
      </div>
      <input
        id={id}
        type="range"
        min="0"
        max={MAX_TANK_GAL}
        step="0.5"
        value={Math.min(MAX_TANK_GAL, Math.max(0, gal || 0))}
        onChange={(e) => onChange(e.target.value)}
        className="wbc-slider"
      />
      <div className="wbc-tank-scale">
        <span>0</span>
        <span>{MAX_TANK_GAL / 2}</span>
        <span>{MAX_TANK_GAL} gal max</span>
      </div>
    </div>
  );
}

export default function WeightBalanceCalculator() {
  const [pilotW, setPilotW] = useState("");
  const [copilotW, setCopilotW] = useState("");
  const [leftGal, setLeftGal] = useState("");
  const [rightGal, setRightGal] = useState("");
  const [rear1W, setRear1W] = useState("");
  const [rear2W, setRear2W] = useState("");
  const [bagW, setBagW] = useState("");
  const [pilotName, setPilotName] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [showPrint, setShowPrint] = useState(false);

  const num = (v) => Math.max(0, parseFloat(v) || 0);

  const result = useMemo(() => {
    const pW = num(pilotW);
    const cW = num(copilotW);
    const lGal = num(leftGal);
    const rGal = num(rightGal);
    const r1W = num(rear1W);
    const r2W = num(rear2W);
    const bW = num(bagW);
    const lFuelW = lGal * 6;
    const rFuelW = rGal * 6;

    const rows = [
      { label: "Aircraft Empty Weight", weight: EMPTY.weight, arm: EMPTY.arm, moment: EMPTY.moment, locked: true },
      { label: "Pilot", weight: pW, arm: ARMS.pilot, moment: pW * ARMS.pilot },
      { label: "Co-Pilot", weight: cW, arm: ARMS.copilot, moment: cW * ARMS.copilot },
      { label: `Left Tank (${lGal.toFixed(1)} gal @ 6 lbs/gal)`, weight: lFuelW, arm: ARMS.leftTank, moment: lFuelW * ARMS.leftTank },
      { label: `Right Tank (${rGal.toFixed(1)} gal @ 6 lbs/gal)`, weight: rFuelW, arm: ARMS.rightTank, moment: rFuelW * ARMS.rightTank },
      { label: "Rear Seat 1", weight: r1W, arm: ARMS.rear1, moment: r1W * ARMS.rear1 },
      { label: "Rear Seat 2", weight: r2W, arm: ARMS.rear2, moment: r2W * ARMS.rear2 },
      { label: "Baggage Compartment", weight: bW, arm: ARMS.baggage, moment: bW * ARMS.baggage },
    ];

    const totalWeight = rows.reduce((s, r) => s + r.weight, 0);
    const totalMoment = rows.reduce((s, r) => s + r.moment, 0);
    const cg = totalMoment / totalWeight;
    const totalFuelGal = lGal + rGal;

    const problems = [];
    if (lGal > MAX_TANK_GAL) problems.push("Left tank exceeds 18 gal capacity");
    if (rGal > MAX_TANK_GAL) problems.push("Right tank exceeds 18 gal capacity");
    if (bW > MAX_BAGGAGE) problems.push("Baggage exceeds 100 lb limit");
    if (totalWeight > MAX_GROSS) problems.push("Over max gross weight (1,950 lbs)");
    const inEnvelope = pointInPolygon([cg, Math.min(totalWeight, 1950)], ENVELOPE) && totalWeight <= MAX_GROSS;
    if (!inEnvelope && totalWeight <= MAX_GROSS) problems.push("CG outside approved envelope");

    return { rows, totalWeight, totalMoment, cg, totalFuelGal, problems, ok: problems.length === 0 };
  }, [pilotW, copilotW, leftGal, rightGal, rear1W, rear2W, bagW]);

  const handleCalculate = () => setCalculated(true);
  const handleReset = () => {
    setPilotW("");
    setCopilotW("");
    setLeftGal("");
    setRightGal("");
    setRear1W("");
    setRear2W("");
    setBagW("");
    setPilotName("");
    setFlightDate("");
    setCalculated(false);
    setShowPrint(false);
  };
  const handlePrint = () => {
    setCalculated(true);
    setShowPrint(true);
    setTimeout(() => window.print(), 80);
  };

  return (
    <div className="wbc-root">
      <style>{CSS}</style>

      <div className="wbc-frame">
        <header className="wbc-masthead">
          <span className="wbc-tag">N2610A &middot; Piper PA-22/135</span>
          <h1>Tri-Pacer Weight &amp; Balance Calculator</h1>
          <div className="wbc-sub">Datum: 60&Prime; forward of wing leading edge &middot; Max Gross Weight: 1,950 lbs</div>

          <div className="wbc-locked-strip">
            <div className="wbc-locked-cell">
              <div className="wbc-lbl">Empty Weight</div>
              <div className="wbc-val">1,138 lbs</div>
            </div>
            <div className="wbc-locked-cell">
              <div className="wbc-lbl">Empty CG</div>
              <div className="wbc-val">70.87 in</div>
            </div>
            <div className="wbc-locked-cell">
              <div className="wbc-lbl">Empty Moment</div>
              <div className="wbc-val">80,643 in-lbs</div>
            </div>
          </div>
        </header>

        <main>
          <div className="wbc-section-title">Aircraft Diagram</div>
          <div className="wbc-diagram-card">
            <AircraftDiagram />
          </div>

          <div className="wbc-section-title">Front Seats</div>
          <div className="wbc-two-col">
            <WeightField id="pilotWeight" label="Pilot" value={pilotW} onChange={setPilotW} />
            <WeightField id="copilotWeight" label="Co-Pilot" value={copilotW} onChange={setCopilotW} />
          </div>

          <div className="wbc-section-title">Fuel &mdash; Wing Tanks (18 gal each side)</div>
          <div className="wbc-two-col">
            <TankSlider id="leftTank" label="Left Tank" gal={leftGal} onChange={setLeftGal} />
            <TankSlider id="rightTank" label="Right Tank" gal={rightGal} onChange={setRightGal} />
          </div>
          <div className="wbc-fuel-total">
            Total Fuel: <strong>{fmt(num(leftGal) + num(rightGal), 1)} gal</strong> &middot; <strong>{fmt((num(leftGal) + num(rightGal)) * 6, 0)} lbs</strong>
          </div>

          <div className="wbc-section-title">Rear Cabin</div>
          <div className="wbc-two-col">
            <WeightField id="rear1Weight" label="Rear Seat 1" value={rear1W} onChange={setRear1W} />
            <WeightField id="rear2Weight" label="Rear Seat 2" value={rear2W} onChange={setRear2W} />
          </div>

          <div className="wbc-section-title">Baggage (max 100 lbs)</div>
          <div className="wbc-two-col wbc-two-col-single">
            <WeightField id="baggageWeight" label="Baggage Compartment" value={bagW} onChange={setBagW} />
          </div>

          <div className="wbc-section-title">Loading Summary</div>
          <table className="wbc-table">
            <thead>
              <tr>
                <th>Station</th>
                <th style={{ textAlign: "right" }}>Weight (lbs)</th>
                <th style={{ textAlign: "right" }}>Arm (in aft)</th>
                <th style={{ textAlign: "right" }}>Moment (in-lbs)</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r, i) => (
                <tr key={i} className={r.locked ? "wbc-locked-row" : ""}>
                  <td className="wbc-station-name">{r.label}</td>
                  <td style={{ textAlign: "right" }} className={r.locked ? "wbc-arm-val" : "wbc-moment-val"}>
                    {fmt(r.weight, r.locked ? 1 : 1)}
                  </td>
                  <td style={{ textAlign: "right" }} className="wbc-arm-val">{r.arm.toFixed(2)}</td>
                  <td style={{ textAlign: "right" }} className="wbc-moment-val">{fmt(r.moment, 0)}</td>
                </tr>
              ))}
              <tr className="wbc-totals-row">
                <td>Takeoff Totals</td>
                <td style={{ textAlign: "right" }} className="wbc-arm-val">{fmt(result.totalWeight, 1)}</td>
                <td style={{ textAlign: "right" }} className="wbc-arm-val">{isFinite(result.cg) ? result.cg.toFixed(2) : "—"}</td>
                <td style={{ textAlign: "right" }} className="wbc-moment-val">{fmt(result.totalMoment, 0)}</td>
              </tr>
            </tbody>
          </table>

          <div className="wbc-pilot-fields">
            <div className="wbc-field">
              <label>Pilot Name</label>
              <input type="text" value={pilotName} onChange={(e) => setPilotName(e.target.value)} placeholder="e.g. Jane Doe" />
            </div>
            <div className="wbc-field">
              <label>Date of Flight</label>
              <input type="date" value={flightDate} onChange={(e) => setFlightDate(e.target.value)} />
            </div>
          </div>

          <div className="wbc-results-grid">
            <div className="wbc-readout-card">
              <div className="wbc-section-title" style={{ marginTop: 0 }}>Results</div>
              <div className="wbc-readout-row"><span className="wbc-lbl">Total Weight</span><span className="wbc-val">{fmt(result.totalWeight, 1)} lbs</span></div>
              <div className="wbc-readout-row"><span className="wbc-lbl">Total Moment</span><span className="wbc-val">{fmt(result.totalMoment, 0)} in-lbs</span></div>
              <div className="wbc-readout-row"><span className="wbc-lbl">Center of Gravity</span><span className="wbc-val">{isFinite(result.cg) ? result.cg.toFixed(2) : "—"} in</span></div>
              <div className="wbc-readout-row"><span className="wbc-lbl">Margin to Max Gross</span><span className="wbc-val">{fmt(MAX_GROSS - result.totalWeight, 1)} lbs</span></div>

              {!calculated ? (
                <div className="wbc-status-banner idle">Enter loading values and press Calculate.</div>
              ) : result.ok ? (
                <div className="wbc-status-banner ok">&#10003; Within weight &amp; CG envelope &mdash; safe for takeoff loading as entered.</div>
              ) : (
                <div className="wbc-status-banner warn">&#9888; NOT SAFE: {result.problems.join(" &middot; ")}</div>
              )}
            </div>

            <div className="wbc-chart-card">
              <EnvelopeChart cg={calculated ? result.cg : EMPTY.arm} weight={calculated ? result.totalWeight : EMPTY.weight} ok={result.ok} />
            </div>
          </div>

          <div className="wbc-actions">
            <button className="wbc-btn-primary" onClick={handleCalculate}>Calculate</button>
            <button className="wbc-btn-ghost" onClick={handleReset}>Reset</button>
            <button className="wbc-btn-ghost" onClick={handlePrint} disabled={!calculated}>
              Print / Save Pilot Copy (PDF)
            </button>
          </div>
        </main>

        <footer className="wbc-foot">
          Piper PA-22/135 Tri-Pacer &middot; N2610A &middot; For planning reference only &mdash; verify against current POH/AFM weight &amp; balance data before flight.
        </footer>
      </div>

      {/* ===================== PRINT-ONLY PILOT COPY ===================== */}
      {/* Rendered via portal directly under <body> so print CSS can reliably
          hide every OTHER element on the host page (this component is often
          embedded inline inside a much larger page, not standalone). */}
      {showPrint && typeof document !== "undefined" && createPortal(
        <div id="wbcPrintReport">
          <div className="wbc-pr-page">
            <p className="wbc-pr-title">Piper PA-22/135 Tri-Pacer &mdash; Weight &amp; Balance Worksheet</p>
            <p className="wbc-pr-sub">N2610A &middot; Datum: 60&Prime; forward of wing leading edge &middot; Max Gross Weight: 1,950 lbs</p>
            <div className="wbc-pr-meta">
              <span>Pilot: <strong>{pilotName || "—"}</strong></span>
              <span>Date: <strong>{flightDate || "—"}</strong></span>
              <span>Generated: <strong>{new Date().toLocaleString("en-US")}</strong></span>
            </div>

            <table className="wbc-pr-table">
              <thead>
                <tr><th>Loading Station</th><th style={{ textAlign: "right" }}>Weight (lbs)</th><th style={{ textAlign: "right" }}>Arm (in aft)</th><th style={{ textAlign: "right" }}>Moment (in-lbs)</th></tr>
              </thead>
              <tbody>
                {result.rows.map((r, i) => (
                  <tr key={i} className={r.locked ? "wbc-pr-locked" : ""}>
                    <td>{r.label}</td>
                    <td style={{ textAlign: "right" }}>{fmt(r.weight, 1)}</td>
                    <td style={{ textAlign: "right" }}>{r.arm.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>{fmt(r.moment, 0)}</td>
                  </tr>
                ))}
                <tr className="wbc-pr-total">
                  <td>Takeoff Totals</td>
                  <td style={{ textAlign: "right" }}>{fmt(result.totalWeight, 1)}</td>
                  <td style={{ textAlign: "right" }}>{isFinite(result.cg) ? result.cg.toFixed(2) : "—"}</td>
                  <td style={{ textAlign: "right" }}>{fmt(result.totalMoment, 0)}</td>
                </tr>
              </tbody>
            </table>

            <div className={`wbc-pr-status ${result.ok ? "ok" : "warn"}`}>
              {result.ok ? "✓ WITHIN APPROVED WEIGHT & CG ENVELOPE" : `⚠ NOT WITHIN LIMITS: ${result.problems.join(" · ")}`}
            </div>

            <div className="wbc-pr-chart-wrap">
              <EnvelopeChart cg={result.cg} weight={result.totalWeight} ok={result.ok} idSuffix="-pr" />
            </div>

            <div className="wbc-pr-sign">
              <div>Pilot in Command Signature</div>
              <div>Date</div>
            </div>

            <p className="wbc-pr-footnote">
              This worksheet was generated by the KWLD N2610A Weight &amp; Balance Calculator for planning purposes only.
              Empty weight, empty CG, and empty moment are locked baseline values for this specific aircraft (N2610A) and
              must be re-verified after any equipment change or reweigh per the current equipment list / weight &amp; balance
              record. Pilot in command remains responsible for confirming the aircraft is loaded within its approved weight
              and center-of-gravity limits prior to flight.
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const CSS = `
.wbc-root{
  --wbc-panel-bg:#14181c; --wbc-panel-bg-2:#1b2126; --wbc-hairline:#2c353c;
  --wbc-amber:#ffb02e; --wbc-amber-dim:#8a5c17; --wbc-paper:#f4efe4;
  --wbc-ink:#1a1712; --wbc-ok:#3ecf6b; --wbc-warn:#ff5a4e; --wbc-steel:#9fb0bb;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}
.wbc-root *{box-sizing:border-box;}
.wbc-root{
  background:
    radial-gradient(1200px 600px at 15% -10%, #1e2530 0%, transparent 60%),
    radial-gradient(1000px 700px at 110% 10%, #10151a 0%, transparent 55%),
    #0b0e11;
  color:var(--wbc-paper); min-height:100vh; padding:28px 14px 80px;
}
.wbc-frame{
  max-width:980px; margin:0 auto; background:var(--wbc-panel-bg);
  border-radius:18px; box-shadow:0 30px 60px -20px rgba(0,0,0,.6);
  border:1px solid var(--wbc-hairline); overflow:hidden; position:relative;
}
.wbc-masthead{ padding:30px 34px 22px; border-bottom:2px solid var(--wbc-hairline); background:linear-gradient(180deg,#191f24,#151a1e); }
.wbc-tag{ display:inline-flex; align-items:center; gap:10px; background:var(--wbc-amber); color:#1a1200; font-weight:700; letter-spacing:.08em; padding:5px 12px; border-radius:4px; font-size:13px; text-transform:uppercase; }
.wbc-masthead h1{ margin:14px 0 4px; font-size:clamp(26px,4vw,36px); color:var(--wbc-paper); font-weight:700; }
.wbc-sub{ color:var(--wbc-steel); font-size:15px; }
.wbc-locked-strip{ margin-top:18px; display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--wbc-hairline); border:1px solid var(--wbc-hairline); border-radius:10px; overflow:hidden; }
.wbc-locked-cell{ background:var(--wbc-panel-bg-2); padding:12px 16px; text-align:center; }
.wbc-locked-cell .wbc-lbl{ font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:var(--wbc-steel); }
.wbc-locked-cell .wbc-val{ font-family:monospace; font-size:20px; font-weight:600; color:var(--wbc-amber); margin-top:4px; }
.wbc-root main{ padding:28px 34px 10px; }
.wbc-section-title{ display:flex; align-items:center; gap:12px; margin:26px 0 14px; font-size:13px; letter-spacing:.16em; text-transform:uppercase; color:var(--wbc-steel); }
.wbc-section-title::after{ content:""; flex:1; height:1px; background:var(--wbc-hairline); }

.wbc-diagram-card{ background:var(--wbc-panel-bg-2); border:1px solid var(--wbc-hairline); border-radius:12px; padding:16px; color:var(--wbc-steel); }
.wbc-diagram-svg{ width:100%; height:auto; display:block; max-height:420px; margin:0 auto; }
.wbc-diagram-label{ font-size:13px; font-weight:700; letter-spacing:.03em; fill:var(--wbc-paper); }
.wbc-diagram-label-sm{ font-size:11px; }
.wbc-diagram-label-sub{ font-size:9px; fill:var(--wbc-steel); }
.wbc-diagram-dim{ font-size:11px; letter-spacing:.1em; fill:var(--wbc-steel); }

.wbc-two-col{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.wbc-two-col-single{ grid-template-columns:1fr; max-width:340px; }
@media (max-width:640px){ .wbc-two-col{ grid-template-columns:1fr; } }

.wbc-wfield{ background:var(--wbc-panel-bg-2); border:1px solid var(--wbc-hairline); border-radius:10px; padding:14px 16px; }
.wbc-wfield label{ display:block; font-size:12px; text-transform:uppercase; letter-spacing:.08em; color:var(--wbc-steel); margin-bottom:8px; }
.wbc-wfield-input{ display:flex; align-items:center; gap:8px; }
.wbc-wfield-unit{ color:var(--wbc-steel); font-size:13px; }

.wbc-tank{ background:var(--wbc-panel-bg-2); border:1px solid var(--wbc-hairline); border-radius:10px; padding:14px 16px; }
.wbc-tank-head{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px; flex-wrap:wrap; gap:6px; }
.wbc-tank-head label{ font-size:12px; text-transform:uppercase; letter-spacing:.08em; color:var(--wbc-steel); }
.wbc-tank-readout{ font-family:monospace; font-size:14px; color:var(--wbc-amber); font-weight:600; }
.wbc-tank-arrow{ color:var(--wbc-steel); }
.wbc-slider{
  -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:4px;
  background:linear-gradient(90deg, var(--wbc-amber) 0%, var(--wbc-amber) var(--_p, 0%), var(--wbc-hairline) var(--_p, 0%), var(--wbc-hairline) 100%);
  outline:none; cursor:pointer;
}
.wbc-slider::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:var(--wbc-amber); border:2px solid #0b0e11; cursor:pointer; }
.wbc-slider::-moz-range-thumb{ width:18px; height:18px; border-radius:50%; background:var(--wbc-amber); border:2px solid #0b0e11; cursor:pointer; }
.wbc-tank-scale{ display:flex; justify-content:space-between; margin-top:6px; font-size:10px; color:var(--wbc-steel); }
.wbc-fuel-total{ margin-top:10px; text-align:right; color:var(--wbc-steel); font-size:14px; }
.wbc-fuel-total strong{ color:var(--wbc-amber); font-family:monospace; }

.wbc-table{ width:100%; border-collapse:collapse; background:var(--wbc-panel-bg-2); border-radius:10px; overflow:hidden; border:1px solid var(--wbc-hairline); }
.wbc-table th{ text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:var(--wbc-steel); font-weight:600; padding:12px 14px; background:#10151a; border-bottom:1px solid var(--wbc-hairline); }
.wbc-table td{ padding:10px 14px; border-bottom:1px solid var(--wbc-hairline); font-size:15px; vertical-align:middle; }
.wbc-table tr:last-child td{ border-bottom:none; }
.wbc-station-name{ color:var(--wbc-paper); font-weight:500; }
.wbc-num{ width:100%; background:#0e1216; border:1px solid var(--wbc-hairline); color:var(--wbc-amber); font-family:monospace; font-size:16px; padding:8px 10px; border-radius:6px; text-align:right; }
.wbc-num:focus{ outline:2px solid var(--wbc-amber); outline-offset:1px; }
.wbc-arm-val, .wbc-moment-val{ font-family:monospace; color:var(--wbc-paper); font-size:15px; }
.wbc-moment-val{ color:var(--wbc-steel); }
.wbc-locked-row td{ color:var(--wbc-steel); font-style:italic; }
.wbc-totals-row td{ font-weight:700; font-size:16px; color:var(--wbc-paper); background:#171d22; border-top:2px solid var(--wbc-amber-dim); }
.wbc-totals-row .wbc-moment-val, .wbc-totals-row .wbc-arm-val{ color:var(--wbc-amber); font-weight:700; }
.wbc-results-grid{ display:grid; grid-template-columns:1.1fr 1fr; gap:22px; margin-top:26px; }
@media (max-width:760px){ .wbc-results-grid{ grid-template-columns:1fr; } }
.wbc-readout-card{ background:var(--wbc-panel-bg-2); border:1px solid var(--wbc-hairline); border-radius:12px; padding:20px; }
.wbc-readout-row{ display:flex; justify-content:space-between; align-items:baseline; padding:10px 0; border-bottom:1px dashed var(--wbc-hairline); }
.wbc-readout-row:last-child{ border-bottom:none; }
.wbc-readout-row .wbc-lbl{ color:var(--wbc-steel); font-size:14px; }
.wbc-readout-row .wbc-val{ font-family:monospace; font-size:19px; color:var(--wbc-paper); font-weight:600; }
.wbc-status-banner{ margin-top:16px; padding:14px 16px; border-radius:10px; font-weight:700; font-size:15px; }
.wbc-status-banner.ok{ background:rgba(62,207,107,.12); color:var(--wbc-ok); border:1px solid rgba(62,207,107,.4); }
.wbc-status-banner.warn{ background:rgba(255,90,78,.12); color:var(--wbc-warn); border:1px solid rgba(255,90,78,.4); }
.wbc-status-banner.idle{ background:rgba(159,176,187,.08); color:var(--wbc-steel); border:1px solid var(--wbc-hairline); }
.wbc-chart-card{ background:var(--wbc-panel-bg-2); border:1px solid var(--wbc-hairline); border-radius:12px; padding:16px; }
.wbc-pilot-fields{ display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:22px; }
.wbc-field label{ display:block; font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:var(--wbc-steel); margin-bottom:6px; }
.wbc-field input{ width:100%; background:#0e1216; border:1px solid var(--wbc-hairline); color:var(--wbc-paper); font-size:15px; padding:10px 12px; border-radius:6px; }
.wbc-actions{ display:flex; gap:14px; flex-wrap:wrap; margin:30px 0 6px; }
.wbc-root button{ font-weight:600; letter-spacing:.04em; font-size:15px; padding:14px 26px; border-radius:8px; border:none; cursor:pointer; }
.wbc-btn-primary{ background:var(--wbc-amber); color:#1a1200; box-shadow:0 8px 20px -8px rgba(255,176,46,.55); }
.wbc-btn-ghost{ background:transparent; color:var(--wbc-paper); border:1px solid var(--wbc-hairline); }
.wbc-btn-ghost[disabled]{ opacity:.4; cursor:not-allowed; }
.wbc-foot{ padding:18px 34px 28px; color:var(--wbc-steel); font-size:12px; text-align:center; border-top:1px solid var(--wbc-hairline); }

#wbcPrintReport{ display:none; }
@media print{
  @page{ margin: 0.4in; }
  html, body{ background:#fff !important; margin:0 !important; padding:0 !important; }
  body > *{ display:none !important; }
  body > #wbcPrintReport{ display:block !important; }
}
.wbc-pr-page{ width:100%; max-width:900px; margin:0 auto; font-family:Arial, Helvetica, sans-serif; color:#111; padding:16px 20px 8px; }
.wbc-pr-title{ font-size:19px; font-weight:800; text-align:center; margin:0 0 3px; }
.wbc-pr-sub{ font-size:11.5px; text-align:center; color:#444; margin:0 0 10px; }
.wbc-pr-meta{ display:flex; justify-content:space-between; font-size:11px; color:#333; border-top:1px solid #999; border-bottom:1px solid #999; padding:5px 0; margin-bottom:10px; }
.wbc-pr-table{ width:100%; border-collapse:collapse; font-size:12px; margin-bottom:12px; }
.wbc-pr-table th{ background:#1e2a38; color:#fff; text-align:left; padding:5px 10px; font-size:10.5px; text-transform:uppercase; letter-spacing:.04em; }
.wbc-pr-table td{ padding:3px 10px; border-bottom:1px solid #ccc; }
.wbc-pr-locked td{ color:#555; font-style:italic; }
.wbc-pr-total td{ font-weight:800; background:#f0f0f0; border-top:2px solid #333; }
.wbc-pr-status{ padding:8px 14px; border-radius:6px; font-weight:800; font-size:13px; margin-bottom:10px; border:2px solid; }
.wbc-pr-status.ok{ border-color:#2a8a4a; color:#1c5e33; background:#eafaf0; }
.wbc-pr-status.warn{ border-color:#c0392b; color:#8a231a; background:#fdecea; }
.wbc-pr-chart-wrap{ border:1px solid #999; border-radius:6px; padding:6px; margin-bottom:12px; max-width:520px; margin-left:auto; margin-right:auto; }
.wbc-pr-sign{ display:flex; justify-content:space-between; gap:40px; margin-top:60px; }
.wbc-pr-sign div{ flex:1; border-top:1px solid #333; padding-top:6px; font-size:12px; color:#333; }
.wbc-pr-footnote{ font-size:8.5px; color:#666; margin-top:8px; line-height:1.25; }
`;
