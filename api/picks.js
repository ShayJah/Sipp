module.exports = async function handler(req, res) {
  const { winery: winerySlug, picks: picksParam } = req.query;

  // Parse "recXXX:4,recYYY:3" → [{id, rating}]
  const picks = (picksParam || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(p => {
      const [id, r] = p.split(":");
      return { id: id?.trim(), rating: parseInt(r) || 0 };
    })
    .filter(p => p.id);

  const token  = process.env.AIRTABLE_TOKEN  || process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.BASE_ID;

  let winery = { name: "Sipp", mark: "S", tagline: "", blurb: "" };
  let wines  = [];

  if (token && baseId) {
    const h    = { Authorization: `Bearer ${token}` };
    const root = `https://api.airtable.com/v0/${baseId}`;

    try {
      if (winerySlug) {
        const wr = await fetch(
          `${root}/Wineries?filterByFormula=%7BSlug%7D%3D%22${encodeURIComponent(winerySlug)}%22&maxRecords=1`,
          { headers: h }
        );
        const wd = await wr.json();
        if (wd.records?.[0]) {
          const f = wd.records[0].fields;
          winery = {
            name:    f.Name    || winery.name,
            mark:    f.Mark    || winery.mark,
            tagline: f.Tagline || "",
            blurb:   f.Blurb   || "",
          };
        }
      }

      if (picks.length > 0) {
        const formula = picks.length === 1
          ? `RECORD_ID()="${picks[0].id}"`
          : `OR(${picks.map(p => `RECORD_ID()="${p.id}"`).join(",")})`;

        const wr2 = await fetch(
          `${root}/Wines?filterByFormula=${encodeURIComponent(formula)}`,
          { headers: h }
        );
        const wd2 = await wr2.json();

        const raw = (wd2.records || []).map(r => {
          const f = r.fields;
          return {
            id:       r.id,
            name:     f.Name    || "Unknown Wine",
            grape:    f.Grape   || "",
            vintage:  f.Vintage || "NV",
            color:    f.Color   || "#C4773B",
            price:    f.Price   || 0,
            award:    f.Award   || null,
            imageUrl: f.Photo?.[0]?.url || null,
            rating:   picks.find(p => p.id === r.id)?.rating || 0,
          };
        });

        // Preserve the order the guest tasted them
        wines = raw.sort((a, b) => {
          return picks.findIndex(p => p.id === a.id) - picks.findIndex(p => p.id === b.id);
        });
      }
    } catch (err) {
      console.error("Airtable picks fetch failed:", err);
    }
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(renderHTML(winery, wines));
};

// ─── HTML renderer ───────────────────────────────────────────────────────────

function renderHTML(winery, wines) {
  const hasWines = wines.length > 0;
  const fallbackColors = ["#6B2D2D", "#4A6741", "#C4773B", "#5E3D6B", "#2E5E6B"];

  const wineCards = wines.map((w, i) => {
    const filled = Math.max(0, Math.min(5, Math.round(w.rating)));
    const starRow = Array.from({ length: 5 }, (_, k) =>
      `<span class="${k < filled ? "s-on" : "s-off"}">★</span>`
    ).join("");

    const thumb = w.imageUrl
      ? `<img src="${ea(w.imageUrl)}" alt="${ea(w.name)}" loading="lazy">`
      : `<div class="thumb-fill" style="background:${ea(w.color || fallbackColors[i % fallbackColors.length])}"></div>`;

    return `
    <div class="wine-card">
      <div class="thumb">${thumb}</div>
      <div class="wine-info">
        <div class="wine-name">${eh(w.name)}</div>
        <div class="wine-meta">${eh(w.vintage)}${w.grape ? ` · ${eh(w.grape)}` : ""}</div>
        <div class="wine-stars">${starRow}</div>
        ${w.price ? `<div class="wine-price">$${w.price}</div>` : ""}
        ${w.award ? `<div class="wine-award">🏅 ${eh(w.award)}</div>` : ""}
      </div>
    </div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="theme-color" content="#0F0705">
  <title>Your Tasting · ${eh(winery.name)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --a:#C4773B;--al:#D4996A;
      --bg:#0F0705;--bg2:#1A0D0A;--card:#1F110D;
      --border:rgba(196,119,59,.18);
      --text:#F5ECD7;--muted:rgba(245,236,215,.55);
      --serif:'Playfair Display',Georgia,serif;
      --sans:'Lato',system-ui,sans-serif;
    }
    body{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100dvh;-webkit-font-smoothing:antialiased}

    /* header */
    .header{padding:40px 24px 28px;text-align:center;border-bottom:1px solid var(--border);background:linear-gradient(180deg,#1A0D0A 0%,var(--bg) 100%)}
    .monogram{width:56px;height:56px;border-radius:50%;background:var(--a);color:#fff;font-family:var(--serif);font-size:18px;font-weight:600;letter-spacing:.05em;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px}
    .winery-name{font-family:var(--serif);font-size:21px;font-weight:600;margin-bottom:4px}
    .winery-tag{font-size:11px;color:var(--muted);letter-spacing:.07em;text-transform:uppercase}
    .flight-label{margin-top:18px;font-size:12px;color:var(--al);letter-spacing:.12em;text-transform:uppercase}

    /* main */
    .main{padding:0 16px 56px;max-width:480px;margin:0 auto}

    /* club banner */
    .club{margin:20px 0 4px;background:linear-gradient(135deg,#2A1200 0%,#3D1A06 55%,#2A1200 100%);border:1px solid rgba(196,119,59,.32);border-radius:16px;padding:22px 20px 20px;position:relative;overflow:hidden}
    .club::after{content:"";position:absolute;top:-50px;right:-50px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(196,119,59,.14) 0%,transparent 70%);pointer-events:none}
    .club-eyebrow{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--a);font-weight:700;margin-bottom:8px}
    .club-title{font-family:var(--serif);font-size:20px;line-height:1.25;margin-bottom:6px}
    .club-sub{font-size:13px;color:var(--muted);line-height:1.55;margin-bottom:18px}
    .club-sub strong{color:var(--al);font-weight:600}
    .club-btn{display:inline-block;background:var(--a);color:#fff;font-family:var(--sans);font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;padding:12px 26px;border-radius:9px;transition:opacity .15s}
    .club-btn:active{opacity:.8}

    /* section */
    .section-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:700;margin:28px 0 12px}

    /* wine card */
    .wine-card{background:var(--card);border:1px solid var(--border);border-radius:13px;padding:14px;display:flex;gap:14px;align-items:flex-start;margin-bottom:10px}
    .thumb{width:56px;height:56px;border-radius:9px;flex-shrink:0;overflow:hidden;background:#2A1400}
    .thumb img{width:100%;height:100%;object-fit:cover;display:block}
    .thumb-fill{width:100%;height:100%}
    .wine-info{flex:1;min-width:0}
    .wine-name{font-family:var(--serif);font-size:15px;font-weight:600;line-height:1.25;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .wine-meta{font-size:11px;color:var(--muted);letter-spacing:.03em;margin-bottom:7px}
    .wine-stars{font-size:17px;letter-spacing:1px;line-height:1}
    .s-on{color:var(--a)}.s-off{color:rgba(196,119,59,.22)}
    .wine-price{font-size:11px;color:var(--al);font-weight:600;margin-top:5px}
    .wine-award{font-size:10px;color:var(--muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

    /* empty */
    .empty{text-align:center;padding:52px 24px;color:var(--muted)}
    .empty-icon{font-size:44px;margin-bottom:14px}
    .empty-title{font-family:var(--serif);font-size:20px;color:var(--text);margin-bottom:8px}
    .empty-sub{font-size:13px;line-height:1.6}

    /* footer */
    .footer{text-align:center;padding:28px 24px 36px;font-size:11px;color:rgba(245,236,215,.28);letter-spacing:.06em}
    .footer b{color:var(--a)}
  </style>
</head>
<body>

<div class="header">
  <div class="monogram">${eh(winery.mark)}</div>
  <div class="winery-name">${eh(winery.name)}</div>
  ${winery.tagline ? `<div class="winery-tag">${eh(winery.tagline)}</div>` : ""}
  <div class="flight-label">— Your Tasting Flight —</div>
</div>

<div class="main">

  <div class="club">
    <div class="club-eyebrow">✦ Members-Only</div>
    <div class="club-title">Enjoyed your tasting?</div>
    <div class="club-sub">Join the Wine Club for exclusive allocations and <strong>15% off</strong> these bottles, delivered straight to your door.</div>
    <a class="club-btn" href="#">Join the Club →</a>
  </div>

  ${hasWines ? `
  <div class="section-label">Your picks · ${wines.length} wine${wines.length !== 1 ? "s" : ""}</div>
  ${wineCards}
  ` : `
  <div class="empty">
    <div class="empty-icon">🍷</div>
    <div class="empty-title">Your flight awaits</div>
    <div class="empty-sub">No tasting data was found. Ask your host to re-scan the kiosk QR code.</div>
  </div>
  `}

</div>

<div class="footer">powered by <b>Sipp</b> · Okanagan Wine Passport</div>

</body>
</html>`;
}

function eh(s) {
  return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function ea(s) {
  return String(s ?? "").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
