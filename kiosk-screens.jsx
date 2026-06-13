// Non-lookbook screens: Attract, Welcome, Summary, Transfer, Success (+ phone handoff).
const { useState: useStateS, useEffect: useEffectS } = React;

function AttractScreen({ onBegin, priceLabel, winery }) {
  return (
    <div className="screen attract" onClick={onBegin}>
      <Placeholder label="VINEYARD · KEN BURNS LOOP" tint="#7a3b2e" style={{ position: "absolute", inset: 0 }} />
      <div className="attract-kb" />
      <div className="attract-scrim" />
      <div className="brand-corner">
        <Monogram text={winery.mark} size={46} filled />
        <span className="brand-corner-name">{winery.name}</span>
      </div>
      <div className="attract-center">
        <span className="attract-kicker">— Tasting Experience —</span>
        <h1 className="attract-h1">Tap to begin<br/>your tasting</h1>
        <span className="attract-by">powered by <b>Sipp</b> · Okanagan Wine Passport</span>
      </div>
      <div className="tap-pulse" />
    </div>
  );
}

function WelcomeScreen({ name, setName, onStart, wineCount, winery }) {
  return (
    <div className="screen welcome">
      <div className="welcome-bg" />
      <div className="welcome-inner">
        <Monogram text={winery.mark} size={88} filled />
        <h1 className="welcome-name">{winery.name}</h1>
        <p className="welcome-tag">{winery.tagline}</p>
        <div className="welcome-rule"><span /><span className="diamond">◆</span><span /></div>
        <span className="menu-kicker">Today's tasting menu</span>
        <div className="menu-count"><b>{wineCount}</b> wines to explore</div>
        <div className="name-field">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={18}
          />
        </div>
        <button className="cta primary big" onClick={onStart}>Start Tasting <span className="arr">→</span></button>
      </div>
    </div>
  );
}

function SummaryScreen({ wines, state, name, onEdit, onSave, priceLabel, winery }) {
  const tried = wines.filter((w) => state[w.id]?.tried).length;
  const favs = wines.filter((w) => state[w.id]?.fav).length;
  return (
    <div className="screen summary">
      <div className="sum-head">
        <span className="sum-kicker">Your tasting tonight</span>
        <h1 className="sum-title">{name ? `${name}'s flight` : "Your flight"} at {winery.name}</h1>
        <div className="sum-stat">You tried <b>{tried}</b> of {wines.length} · <b>{favs}</b> favourited</div>
      </div>
      <div className="sum-list">
        {wines.map((w) => {
          const s = state[w.id] || {};
          return (
            <div className={"sum-row" + (s.tried ? "" : " untried")} key={w.id} onClick={() => onEdit(w.id)}>
              <div className="sum-thumb"><WineImage wine={w} radius={8} style={{ position: "absolute", inset: 0 }} /></div>
              <div className="sum-info">
                <span className="sum-wine">{w.name}</span>
                <span className="sum-grape">{w.vintage} · {w.grape}</span>
              </div>
              <div className="sum-right">
                {s.fav && <span className="sum-heart">♥</span>}
                {s.tried
                  ? <Stars value={s.rating} size={20} readonly />
                  : <span className="not-tried">Not tried</span>}
                <span className="edit-link">Edit</span>
              </div>
            </div>
          );
        })}
      </div>
      <button className="cta primary big sticky-cta" onClick={onSave}>Save my tasting <span className="arr">→</span></button>
    </div>
  );
}

function TransferScreen({ onConfirm, name }) {
  return (
    <div className="screen transfer">
      <div className="transfer-inner">
        <span className="t-kicker">— The Okanagan Passport —</span>
        <h1 className="t-title">Take your tasting with you</h1>
        <p className="t-sub">Scan to save your picks, get recommendations for your next winery, and start your Okanagan passport.</p>
        <div className="t-options">
          <div className="t-card qr">
            <div className="qr-frame">
              <FauxQR size={208} seed={11} />
              <div className="qr-corner tl" /><div className="qr-corner tr" /><div className="qr-corner bl" /><div className="qr-corner br" />
            </div>
            <span className="t-card-label">Scan with your camera</span>
            <span className="t-card-sub">No app needed yet</span>
          </div>
          <div className="t-or">or</div>
          <div className="t-card nfc" onClick={onConfirm}>
            <div className="nfc-ring"><NfcIcon size={46} /></div>
            <span className="t-card-label">Tap your phone here</span>
            <span className="t-card-sub">Hold near the reader</span>
          </div>
        </div>
        <div className="t-email">
          <input placeholder="…or enter your email" />
          <button onClick={onConfirm}>Send</button>
        </div>
        <span className="t-fine">🔒 Your data is only yours. We never share it.</span>
      </div>
      <button className="dev-advance" onClick={onConfirm} title="(demo) simulate scan">simulate scan ›</button>
    </div>
  );
}

function SuccessScreen({ wines, state, name, onReset, priceLabel, winery }) {
  const [phase, setPhase] = useStateS(0);
  useEffectS(() => {
    const a = setTimeout(() => setPhase(1), 480);   // check pops
    const b = setTimeout(() => setPhase(2), 1180);  // phone slides in
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  const triedWines = wines.filter((w) => state[w.id]?.tried);
  const showWines = (triedWines.length ? triedWines : wines).slice(0, 4);
  return (
    <div className="screen success">
      <div className="succ-left">
        <div className={"succ-check" + (phase >= 1 ? " in" : "")}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5" /></svg>
        </div>
        <h1 className="succ-h1">Saved!</h1>
        <p className="succ-sub">Check your phone — your tasting is already there.</p>
        <div className="succ-next">
          <span className="succ-next-k">Recommended next</span>
          {NEXT_WINERIES.map((w) => (
            <div className="next-row" key={w.name}>
              <Monogram text={w.mark} size={38} />
              <div><span className="next-name">{w.name}</span><span className="next-note">{w.note}</span></div>
            </div>
          ))}
        </div>
        <button className="reset-link" onClick={onReset}>Done — reset for next guest</button>
      </div>
      <div className="succ-right">
        <div className={"mini-phone" + (phase >= 2 ? " in" : "")}>
          <div className="mp-notch" />
          <div className="mp-screen">
            <div className="mp-top">
              <Monogram text={winery.mark} size={30} filled />
              <span className="mp-hi">{name ? `Welcome, ${name}` : "Welcome"}</span>
              <span className="mp-sub">Here's what you tried at<br/>{winery.name}</span>
            </div>
            <div className="mp-list">
              {showWines.map((w, i) => {
                const s = state[w.id] || {};
                return (
                  <div className="mp-row" key={w.id} style={{ animationDelay: (0.35 + i * 0.12) + "s" }}>
                    <div className="mp-thumb"><Placeholder label="" tint={w.color} radius={6} /></div>
                    <div className="mp-info"><span className="mp-wine">{w.name}</span><span className="mp-grape">{w.grape}</span></div>
                    <div className="mp-stars">{"★".repeat(s.rating || 0)}<span className="mp-star-off">{"★".repeat(5 - (s.rating || 0))}</span></div>
                  </div>
                );
              })}
            </div>
            <div className="mp-stamp"><span className="mp-stamp-ring">✦</span> Passport stamp earned</div>
          </div>
        </div>
        <span className="succ-pull">your tasting, pulled up instantly →</span>
      </div>
    </div>
  );
}

Object.assign(window, { AttractScreen, WelcomeScreen, SummaryScreen, TransferScreen, SuccessScreen });
