export default async function handler(req, res) {
  const gasUrl = process.env.GAS_URL;
  if (!gasUrl) return res.status(500).json({ok:false,error:"GAS_URL belum diset di Vercel."});
  try {
    const url = new URL(gasUrl);
    if (req.method === "GET") {
      for (const [k,v] of Object.entries(req.query || {})) url.searchParams.set(k,String(v));
      const r = await fetch(url.toString()); return res.status(r.ok?200:r.status).send(await r.text());
    }
    if (req.method !== "POST") return res.status(405).json({ok:false,error:"Method tidak diizinkan."});
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const r = await fetch(url.toString(), {method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body});
    return res.status(r.ok?200:r.status).send(await r.text());
  } catch(e) { return res.status(500).json({ok:false,error:e.message||String(e)}); }
}
