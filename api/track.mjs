import crypto from 'node:crypto';

const PIXEL_ID = '2013089799417504';
const GRAPH_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

const sha256 = (v) => v ? crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex') : undefined;

const ALLOWED_HOSTS = [
  'misfinanzaspro-ten.vercel.app',
  'misfinanzaspro.online',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) return res.status(500).json({ error: 'Server not configured' });

  const origin = req.headers.origin || req.headers.referer || '';
  const okOrigin = !origin || ALLOWED_HOSTS.some(h => origin.includes(h)) || origin.startsWith('http://localhost');
  if (!okOrigin) return res.status(403).json({ error: 'Forbidden origin' });

  const body = req.body || {};
  const {
    eventName = 'PageView',
    eventId,
    eventSourceUrl,
    value,
    currency = 'USD',
    email,
    phone,
    fbp,
    fbc,
  } = body;

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const user_data = {
    client_ip_address: ip || undefined,
    client_user_agent: userAgent || undefined,
    fbp: fbp || undefined,
    fbc: fbc || undefined,
  };
  if (email) user_data.em = [sha256(email)];
  if (phone) user_data.ph = [sha256(phone)];

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: 'website',
    user_data,
  };
  if (value !== undefined) event.custom_data = { value: Number(value), currency };

  try {
    const r = await fetch(GRAPH_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ data: [event], access_token: token }),
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : 502).json(data);
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
