const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    const url = new URL(request.url);
    const action = url.pathname.split('/')[1];
    const target = url.searchParams.get('target');
    if (!target) return json({ error: 'Target is required' }, 400);

    try {
      if (action === 'ip') return json(await ipTracker(target));
      if (action === 'dns') return json(await dnsInspector(target));
      if (action === 'expand') return json(await expandUrl(target));
      if (action === 'url') return json(await urlScanner(target));
      if (action === 'phone') return json(await phoneOsint(target));
      return json({ error: 'Endpoint not found' }, 404);
    } catch (error) {
      return json({ error: error.message }, 500);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function ipTracker(ip) {
  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await res.json();
  if(data.status !== 'success') throw new Error(data.message);
  return { ip: data.query, country: data.country, city: data.city, isp: data.isp, lat: data.lat, lon: data.lon };
}

async function dnsInspector(domain) {
  const out = {};
  for (const t of ['A', 'MX', 'NS', 'TXT']) {
    const r = await fetch(`https://dns.google/resolve?name=${domain}&type=${t}`);
    const j = await r.json();
    out[t] = (j.Answer || []).map(a => a.data);
  }
  return out;
}

async function expandUrl(shortUrl) {
  const res = await fetch(shortUrl, { method: 'HEAD', redirect: 'follow' });
  return { original: shortUrl, expanded: res.url };
}

async function urlScanner(url) {
  let domain = url.replace(/^https?:\/\//i, '').split('/')[0].split('?')[0];
  const dns = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
  const dnsData = await dns.json();
  let ip = dnsData.Answer ? dnsData.Answer[0].data : null;
  
  let country = 'Unknown', isp = 'Unknown';
  if (ip) {
    const geo = await fetch(`http://ip-api.com/json/${ip}`).then(r => r.json());
    if (geo.status === 'success') { country = geo.country; isp = geo.isp; }
  }
  
  let age = 'Unknown', verdict = 'Aktif';
  try {
    const rdap = await fetch(`https://rdap.org/domain/${domain}`).then(r => r.json());
    const reg = (rdap.events || []).find(e => e.eventAction === 'registration');
    if (reg) {
      const days = Math.ceil((new Date() - new Date(reg.eventDate)) / (1000 * 60 * 60 * 24));
      age = `${days} hari`;
      if (days < 30) verdict = '🚨 SANGAT MENCURIGAKAN (Domain Baru)';
    }
  } catch { age = 'Data tidak ditemukan'; }

  return { domain, ip, country, isp, age, verdict };
}

async function phoneOsint(phone) {
  // GANTI 'API_KEY_DARI_APILAYER' DENGAN API KEY ANDA
  const API_KEY = 'API_KEY_DARI_APILAYER'; 
  const res = await fetch(`http://apilayer.net/api/validate?access_key=${API_KEY}&number=${phone}`);
  const data = await res.json();
  if (data.valid === false) throw new Error('Nomor tidak valid');
  return {
    nomor: data.international_format,
    negara: data.country_name,
    lokasi: data.location || 'Tidak diketahui',
    operator: data.carrier || 'Tidak diketahui (Mungkin VoIP)',
    tipe: data.line_type || 'Tidak diketahui'
  };
}