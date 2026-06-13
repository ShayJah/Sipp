module.exports = async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: "Missing ?slug=" });

  const token  = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) return res.status(500).json({ error: "Airtable not configured" });

  const h    = { Authorization: `Bearer ${token}` };
  const root = `https://api.airtable.com/v0/${baseId}`;

  // 1. Fetch winery row
  const wr = await fetch(
    `${root}/Wineries?filterByFormula=%7BSlug%7D%3D%22${encodeURIComponent(slug)}%22&maxRecords=1`,
    { headers: h }
  );
  const wd = await wr.json();
  if (!wd.records?.length) return res.status(404).json({ error: `Winery "${slug}" not found` });

  const wf = wd.records[0].fields;

  // 2. Fetch wines for this winery slug
  const wines_r = await fetch(
    `${root}/Wines?filterByFormula=%7BWinerySlug%7D%3D%22${encodeURIComponent(slug)}%22&sort%5B0%5D%5Bfield%5D=Sort&sort%5B0%5D%5Bdirection%5D=asc`,
    { headers: h }
  );
  const wines_d = await wines_r.json();

  const wines = (wines_d.records || []).map(r => {
    const f = r.fields;
    return {
      id: r.id,
      name:         f.Name         || "Untitled",
      grape:        f.Grape        || "",
      vintage:      f.Vintage      || "NV",
      type:         f.Type         || "Wine",
      color:        f.Color        || "#C4773B",
      region:       f.Region       || "",
      notes:        (f.Notes || "").split(",").map(n => n.trim()).filter(Boolean),
      winemaker:    f.WinemakerNote || "",
      pairing:      f.Pairing      || "",
      pairingIcon:  f.PairingIcon  || "🍷",
      price:        f.Price        || 0,
      award:        f.Award        || null,
      imageUrl:     f.Photo?.[0]?.url || null,
      placeholder:  f.Type         || "WINE",
    };
  });

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
  res.json({
    winery: {
      name:    wf.Name    || "",
      mark:    wf.Mark    || "",
      region:  wf.Region  || "",
      tagline: wf.Tagline || "",
      blurb:   wf.Blurb   || "",
    },
    wines,
    nextWineries: [],
  });
};
