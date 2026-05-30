// Shared UI primitives for the Sipp kiosk prototype.
// Exported to window at the bottom so other Babel scripts can use them.
const { useState, useEffect, useRef, useMemo } = React;

// ---- Labelled drop-zone placeholder (no hand-drawn art) -------------------
function Placeholder({ label, tint = "#C4773B", radius = 0, style }) {
  const id = useMemo(() => "ph" + Math.random().toString(36).slice(2, 8), []);
  return (
    <div className="ph" style={{ borderRadius: radius, ...style }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id={id + "g"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tint} stopOpacity="0.34" />
            <stop offset="60%" stopColor={tint} stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.30" />
          </linearGradient>
          <pattern id={id + "p"} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={tint} strokeOpacity="0.16" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={id ? `url(#${id}g)` : tint} />
        <rect width="100%" height="100%" fill={`url(#${id}p)`} />
      </svg>
      <span className="ph-tag">{label}</span>
    </div>
  );
}

// ---- Star rating ----------------------------------------------------------
function Stars({ value = 0, onRate, size = 34, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = (hover || value) >= n;
        return (
          <button
            key={n}
            className={"star" + (on ? " on" : "")}
            disabled={readonly}
            style={{ width: size, height: size }}
            onMouseEnter={() => !readonly && setHover(n)}
            onClick={(e) => { e.stopPropagation(); onRate && onRate(n); }}
            aria-label={n + " stars"}
          >
            <svg viewBox="0 0 24 24" width={size} height={size}>
              <path d="M12 2.2l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.27 6.09 20.38l1.13-6.57L2.45 9.16l6.6-.96L12 2.2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// ---- Heart ----------------------------------------------------------------
function Heart({ on, onToggle, size = 30 }) {
  return (
    <button className={"heart" + (on ? " on" : "")} onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label="Favourite">
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d="M12 21s-7.5-4.6-10-9.2C.4 8.6 1.9 5 5.3 5c2 0 3.4 1.1 4.7 2.7C11.3 6.1 12.7 5 14.7 5 18.1 5 19.6 8.6 22 11.8 19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}

// ---- Faux QR (deterministic, reads as a real QR) --------------------------
function FauxQR({ size = 220, seed = 7, fg = "#1A0D0A", bg = "#F5ECD7" }) {
  const n = 25;
  const cells = useMemo(() => {
    let s = seed * 9301 + 49297;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const g = [];
    const finder = (r, c) =>
      (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (finder(r, c)) continue;
      if (rnd() > 0.52) g.push([r, c]);
    }
    return g;
  }, [seed]);
  const u = size / n;
  const Finder = ({ x, y }) => (
    <g>
      <rect x={x * u} y={y * u} width={7 * u} height={7 * u} fill={fg} />
      <rect x={(x + 1) * u} y={(y + 1) * u} width={5 * u} height={5 * u} fill={bg} />
      <rect x={(x + 2) * u} y={(y + 2) * u} width={3 * u} height={3 * u} fill={fg} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill={bg} />
      {cells.map(([r, c], i) => (
        <rect key={i} x={c * u} y={r * u} width={u} height={u} fill={fg} rx={u * 0.18} />
      ))}
      <Finder x={0} y={0} /><Finder x={n - 7} y={0} /><Finder x={0} y={n - 7} />
    </svg>
  );
}

// ---- NFC glyph ------------------------------------------------------------
function NfcIcon({ size = 30 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M5 8c4-3 10-3 14 0" /><path d="M7 11c2.7-1.8 7.3-1.8 10 0" /><path d="M9 14c1.5-1 4.5-1 6 0" />
    </svg>
  );
}

// ---- Winery monogram mark -------------------------------------------------
function Monogram({ text, size = 52, filled = false }) {
  return (
    <div className={"monogram" + (filled ? " filled" : "")} style={{ width: size, height: size, fontSize: size * 0.34 }}>
      <span>{text}</span>
    </div>
  );
}

Object.assign(window, { Placeholder, Stars, Heart, FauxQR, NfcIcon, Monogram });
