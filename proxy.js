// Capturing Radiance wish-history proxy.
// Browser POSTs the in-game wish URL; this proxy paginates
// HoYo's getGachaLog server-side (no CORS in the browser) and returns normalized
// character-banner rows. Stores nothing, logs nothing, exposes nothing public.
//
// Deploy on Deno Deploy (no per-request subrequest cap, free). Run locally with
// `deno run --allow-net proxy.js`. POST { "url": "<wish link>" } -> { character: [...] }.

const CHAR_BANNERS = ["301", "400"]; // both character event banners
const PAGE_DELAY_MS = 300;           // dodge HoYo retcode -110 "visit too frequently"
const MAX_PAGES = 200;               // hard stop (~4000 pulls/banner) so a bad authkey can't loop forever

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

// The link extractor (wish.ps1) is served as a static file by GitHub Pages
// (vanhexen.github.io/radiance/wish.ps1), so this proxy only does the wish fetch.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "content-type": "application/json" } });

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (req.method !== "POST") return json({ error: "POST a wish url" }, 405);

    let url;
    try {
      url = new URL(((await req.json()).url || "").trim());
    } catch {
      return json({ error: "bad url" }, 400);
    }
    if (!url.searchParams.get("authkey")) return json({ error: "no authkey in url" }, 400);

    // SSRF guard: the fetch target comes from the user's url, so restrict it to HoYo's
    // gacha hosts over https. Blocks using this proxy to probe arbitrary/internal hosts.
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || !(host.endsWith(".hoyoverse.com") || host.endsWith(".mihoyo.com")))
      return json({ error: "url must be a HoYoverse wish link" }, 400);

    // Reuse the link's own origin + auth params. Keep its getGachaLog path if it
    // already has one (base path differs across hosts); else default. Works for
    // global and CN servers since host + path come from the link.
    const path = url.pathname.includes("getGachaLog") ? url.pathname : "/gacha_info/api/getGachaLog";
    const base = new URL(url.origin + path);
    for (const [k, v] of url.searchParams) base.searchParams.set(k, v);
    base.searchParams.set("lang", "en");
    base.searchParams.set("size", "20");

    try {
      const rows = [];
      for (const gachaType of CHAR_BANNERS) {
        let endId = "0";
        for (let page = 1; page <= MAX_PAGES; page++) {
          base.searchParams.set("gacha_type", gachaType);
          base.searchParams.set("page", String(page));
          base.searchParams.set("end_id", endId);

          const r = await fetch(base.toString(), { headers: { "user-agent": "radiance" } });
          const data = await r.json();

          if (data.retcode === -110) { await sleep(1000); page--; continue; } // throttled, retry same page
          if (data.retcode !== 0) return json({ error: hoyoErr(data.retcode), retcode: data.retcode }, 400);

          const list = data.data?.list || [];
          if (!list.length) break;
          for (const p of list) {
            rows.push({
              type: (p.item_type || "").toLowerCase() === "weapon" ? "weapon" : "character",
              name: p.name,
              rarity: Number(p.rank_type),
              timestamp: p.time,   // "YYYY-MM-DD HH:MM:SS"; model slices to the date
              id: p.id,
            });
          }
          endId = list[list.length - 1].id;
          await sleep(PAGE_DELAY_MS);
        }
      }
      // getGachaLog is newest-first; id ascending == chronological across both banners.
      rows.sort((a, b) => (a.id.length - b.id.length) || a.id.localeCompare(b.id));
      return json({ character: rows });
    } catch (e) {
      return json({ error: "fetch failed: " + e.message }, 502);
    }
});

function hoyoErr(code) {
  if (code === -101 || code === -100) return "invalid/expired wish link";
  return "HoYo error " + code;
}
