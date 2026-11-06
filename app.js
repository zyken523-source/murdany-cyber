// GANTI DENGAN URL CLOUDFLARE WORKER ANDA NANTI
const API_URL = ''; 

// Logic Pindah Tab
const navBtns = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

function writeTerminal(id, text) {
  const el = document.getElementById(id);
  el.innerHTML = text + '<span class="blink">_</span>';
}

// 1. URL SCANNER
document.getElementById('scanUrlBtn').addEventListener('click', async () => {
  const val = document.getElementById('urlInput').value;
  if(!val) return alert("Masukkan URL!");
  writeTerminal('terminal-url', `> Target: ${val}\n> Analyzing...\n> Please wait...`);
  if(!API_URL) return writeTerminal('terminal-url', `> [ERROR] API_URL Belum diset!`);

  try {
    const res = await fetch(`${API_URL}/url?target=${encodeURIComponent(val)}`);
    const data = await res.json();
    if(data.error) throw new Error(data.error);
    writeTerminal('terminal-url', `> [SUCCESS]\n> Domain: ${data.domain}\n> IP: ${data.ip}\n> Negara: ${data.country}\n> ISP: ${data.isp}\n> Umur: ${data.age}\n> Status: ${data.verdict}`);
  } catch(e) { writeTerminal('terminal-url', `> [ERROR] ${e.message}`); }
});

// 2. IP TRACKER
document.getElementById('scanIpBtn').addEventListener('click', async () => {
  const val = document.getElementById('ipInput').value;
  if(!val) return alert("Masukkan IP!");
  writeTerminal('terminal-ip', `> IP: ${val}\n> Tracking...\n> Please wait...`);
  if(!API_URL) return writeTerminal('terminal-ip', `> [ERROR] API_URL Belum diset!`);

  try {
    const res = await fetch(`${API_URL}/ip?target=${encodeURIComponent(val)}`);
    const data = await res.json();
    if(data.error) throw new Error(data.error);
    writeTerminal('terminal-ip', `> [SUCCESS]\n> IP: ${data.ip}\n> Negara: ${data.country}\n> Kota: ${data.city}\n> ISP: ${data.isp}\n> Koordinat: ${data.lat}, ${data.lon}`);
  } catch(e) { writeTerminal('terminal-ip', `> [ERROR] ${e.message}`); }
});

// 3. DNS INSPECTOR
document.getElementById('scanDnsBtn').addEventListener('click', async () => {
  const val = document.getElementById('dnsInput').value;
  if(!val) return alert("Masukkan Domain!");
  writeTerminal('terminal-dns', `> Domain: ${val}\n> Fetching records...\n> Please wait...`);
  if(!API_URL) return writeTerminal('terminal-dns', `> [ERROR] API_URL Belum diset!`);

  try {
    const res = await fetch(`${API_URL}/dns?target=${encodeURIComponent(val)}`);
    const data = await res.json();
    if(data.error) throw new Error(data.error);
    writeTerminal('terminal-dns', `> [SUCCESS]\n> A Record: ${data.A.join(', ') || '-'}\n> MX Record: ${data.MX.join(', ') || '-'}\n> NS Record: ${data.NS.join(', ') || '-'}\n> TXT Record: ${data.TXT.join(', ') || '-'}`);
  } catch(e) { writeTerminal('terminal-dns', `> [ERROR] ${e.message}`); }
});

// 4. LINK EXPANDER
document.getElementById('scanExpandBtn').addEventListener('click', async () => {
  const val = document.getElementById('expandInput').value;
  if(!val) return alert("Masukkan Link Pendek!");
  writeTerminal('terminal-expand', `> Short URL: ${val}\n> Expanding...\n> Please wait...`);
  if(!API_URL) return writeTerminal('terminal-expand', `> [ERROR] API_URL Belum diset!`);

  try {
    const res = await fetch(`${API_URL}/expand?target=${encodeURIComponent(val)}`);
    const data = await res.json();
    if(data.error) throw new Error(data.error);
    writeTerminal('terminal-expand', `> [SUCCESS]\n> Link Asli: ${data.expanded}`);
  } catch(e) { writeTerminal('terminal-expand', `> [ERROR] ${e.message}`); }
});

// 5. PHONE OSINT
document.getElementById('scanPhoneBtn').addEventListener('click', async () => {
  const val = document.getElementById('phoneInput').value;
  if(!val) return alert("Masukkan Nomor HP!");
  writeTerminal('terminal-phone', `> Number: ${val}\n> Fetching carrier...\n> Please wait...`);
  if(!API_URL) return writeTerminal('terminal-phone', `> [ERROR] API_URL Belum diset!`);

  try {
    const res = await fetch(`${API_URL}/phone?target=${encodeURIComponent(val)}`);
    const data = await res.json();
    if(data.error) throw new Error(data.error);
    writeTerminal('terminal-phone', `> [SUCCESS]\n> Nomor: ${data.nomor}\n> Negara: ${data.negara}\n> Lokasi: ${data.lokasi}\n> Operator: ${data.operator}\n> Tipe: ${data.tipe}`);
  } catch(e) { writeTerminal('terminal-phone', `> [ERROR] ${e.message}`); }
});