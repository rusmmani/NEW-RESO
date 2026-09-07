const GAS_URL = process.env.GAS_URL;

export default async function handler(req, res) {
  if (!GAS_URL) {
    return res.status(500).json({ ok: false, error: 'GAS_URL belum diset di Vercel.' });
  }

  try {
    const url = new URL(GAS_URL);

    // Teruskan semua query dari /api/reso ke Google Apps Script.
    if (req.method === 'GET') {
      for (const [key, value] of Object.entries(req.query || {})) {
        if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
      }
    }

    let upstream;
    if (req.method === 'GET') {
      upstream = await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
    } else if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      upstream = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body,
        redirect: 'follow'
      });
    } else {
      return res.status(405).json({ ok: false, error: 'Method tidak diizinkan.' });
    }

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (_) {
      return res.status(502).json({
        ok: false,
        error: 'Response Google Apps Script bukan JSON.',
        detail: text.slice(0, 500)
      });
    }

    // GAS mengembalikan {ok:true,data:...}; buka satu lapisan agar frontend simpel.
    if (data && data.ok === true && Object.prototype.hasOwnProperty.call(data, 'data')) {
      return res.status(200).json(data.data);
    }

    return res.status(upstream.ok ? 200 : upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}
