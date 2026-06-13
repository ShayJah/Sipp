// Wine Lookbook card with 3 layout variants: split / immersive / gallery.
const { useState: useStateC } = React;

function WineImage({ wine, style, radius = 0 }) {
  if (wine.imageUrl) {
    return (
      <img
        src={wine.imageUrl} alt={wine.name}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: radius, display: "block", ...style }}
      />
    );
  }
  return <Placeholder label={wine.placeholder} tint={wine.color} radius={radius} style={style} />;
}

function Pill({ children }) { return <span className="note-pill">{children}</span>; }

function TastingNotes({ wine }) {
  return (
    <div className="notes-row">
      {wine.notes.map((nt) => <Pill key={nt}>{nt}</Pill>)}
    </div>
  );
}

function MetaBlock({ wine, compact }) {
  return (
    <div className={"meta-block" + (compact ? " compact" : "")}>
      <div className="meta-line">
        <span className="meta-k">Origin</span>
        <span className="meta-v">{wine.region}</span>
      </div>
      <div className="meta-line">
        <span className="meta-k">Pairs with</span>
        <span className="meta-v"><span className="pair-ico">{wine.pairingIcon}</span>{wine.pairing}</span>
      </div>
      <p className="winemaker">“{wine.winemaker}”<span className="wm-by">— Winemaker's note</span></p>
    </div>
  );
}

// The interaction strip: progress · favourite · I tried this · stars
function ActionBar({ wine, idx, total, st, onTry, onFav, onRate }) {
  return (
    <div className="actionbar">
      <div className="dots">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={"dot" + (i === idx ? " here" : "") + (i < idx ? " past" : "")} />
        ))}
      </div>
      <div className="act-controls">
        <Heart on={st.fav} onToggle={onFav} />
        <button className={"tried-btn" + (st.tried ? " on" : "")} onClick={(e) => { e.stopPropagation(); onTry(); }}>
          <span className="tick">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 6.5" /></svg>
          </span>
          {st.tried ? "Tasted" : "I tried this"}
        </button>
        <div className={"rate-wrap" + (st.tried ? " show" : "")}>
          <Stars value={st.rating} onRate={onRate} size={30} />
        </div>
      </div>
    </div>
  );
}

function Badge({ wine }) {
  return <span className="vint-badge">{wine.vintage} · {wine.grape}</span>;
}

function WineCard({ wine, idx, total, st, onTry, onFav, onRate, layout, showHint, priceLabel }) {
  const handlers = { wine, idx, total, st, onTry, onFav, onRate };

  if (layout === "gallery") {
    return (
      <div className="card gallery">
        <div className="gal-glow" style={{ background: `radial-gradient(closest-side, ${wine.color}55, transparent 72%)` }} />
        <div className="gal-top">
          <Badge wine={wine} />
          {wine.award && <span className="award">✦ {wine.award}</span>}
        </div>
        <h1 className="gal-name">{wine.name}</h1>
        <div className="gal-stage">
          <WineImage wine={wine} radius={10} style={{ width: 168, height: 360 }} />
        </div>
        <TastingNotes wine={wine} />
        <p className="gal-wm">“{wine.winemaker}”</p>
        <div className="gal-foot">
          <span className="meta-v"><span className="pair-ico">{wine.pairingIcon}</span>{wine.pairing}</span>
          <span className="price">{priceLabel}{wine.price}</span>
        </div>
        <ActionBar {...handlers} />
        {idx === 0 && showHint && <SwipeHint />}
      </div>
    );
  }

  if (layout === "immersive") {
    return (
      <div className="card immersive">
        <div className="imm-visual">
          <WineImage wine={wine} style={{ position: "absolute", inset: 0 }} />
          <div className="imm-scrim" />
          <div className="imm-title">
            {wine.award && <span className="award light">✦ {wine.award}</span>}
            <h1 className="big-name">{wine.name}</h1>
            <Badge wine={wine} />
          </div>
        </div>
        <aside className="imm-panel">
          <div className="imm-scroll">
            <span className="panel-label">Tasting notes</span>
            <TastingNotes wine={wine} />
            <MetaBlock wine={wine} />
            <div className="price-line"><span>Bottle</span><span className="price">{priceLabel}{wine.price}</span></div>
          </div>
          <ActionBar {...handlers} />
        </aside>
        {idx === 0 && showHint && <SwipeHint />}
      </div>
    );
  }

  // split (default)
  return (
    <div className="card split">
      <div className="split-visual">
        <WineImage wine={wine} style={{ position: "absolute", inset: 0 }} />
        <div className="split-scrim" />
        <div className="split-overlay">
          {wine.award && <span className="award light">✦ {wine.award}</span>}
          <h1 className="big-name">{wine.name}</h1>
          <Badge wine={wine} />
        </div>
      </div>
      <aside className="split-panel">
        <div className="split-scroll">
          <span className="panel-label">Tasting notes</span>
          <TastingNotes wine={wine} />
          <MetaBlock wine={wine} />
          <div className="price-line"><span>Bottle</span><span className="price">{priceLabel}{wine.price}</span></div>
        </div>
        <ActionBar {...handlers} />
      </aside>
      {idx === 0 && showHint && <SwipeHint />}
    </div>
  );
}

function SwipeHint() {
  return (
    <div className="swipe-hint">
      <div className="swipe-ico">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
      </div>
      <span>Swipe to explore the lineup</span>
    </div>
  );
}

Object.assign(window, { WineCard, WineImage });
