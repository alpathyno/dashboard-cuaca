const AWALAN = "dashboard-cuaca:cache:v1:";
const MAKS_ENTRI = 12;

export const UMUR_SEGAR = 10 * 60 * 1000; // 10 menit

export function kunciLokasi(jenis, lat, lon) {
  return `${jenis}:${lat.toFixed(2)},${lon.toFixed(2)}`;
}

export function bacaCache(kunci) {
  try {
    const mentah = localStorage.getItem(AWALAN + kunci);
    if (!mentah) return null;
    const { data, waktu } = JSON.parse(mentah);
    return { data, waktu };
  } catch {
    return null;
  }
}

export function tulisCache(kunci, data) {
  try {
    localStorage.setItem(AWALAN + kunci, JSON.stringify({ data, waktu: Date.now() }));
    bersihkan();
  } catch {
    /* penyimpanan penuh atau diblokir: abaikan */
  }
}

// Simpan maksimal MAKS_ENTRI kota, buang yang paling lama
function bersihkan() {
  const entri = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(AWALAN)) continue;
    let waktu = 0;
    try {
      waktu = JSON.parse(localStorage.getItem(k)).waktu;
    } catch {
      /* data rusak dianggap paling lama */
    }
    entri.push({ k, waktu });
  }
  entri.sort((a, b) => a.waktu - b.waktu);
  while (entri.length > MAKS_ENTRI) localStorage.removeItem(entri.shift().k);
}