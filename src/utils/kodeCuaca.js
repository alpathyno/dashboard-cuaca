export function artiKodeCuaca(kode) {
  if (kode === 0) return { teks: "Cerah", ikon: "☀️" };
  if (kode === 1) return { teks: "Cerah berawan", ikon: "🌤️" };
  if (kode === 2) return { teks: "Berawan sebagian", ikon: "⛅" };
  if (kode === 3) return { teks: "Mendung", ikon: "☁️" };
  if (kode === 45 || kode === 48) return { teks: "Berkabut", ikon: "🌫️" };
  if (kode >= 51 && kode <= 57) return { teks: "Gerimis", ikon: "🌦️" };
  if (kode >= 61 && kode <= 67) return { teks: "Hujan", ikon: "🌧️" };
  if (kode >= 80 && kode <= 82) return { teks: "Hujan lokal", ikon: "🌧️" };
  if (kode >= 95) return { teks: "Badai petir", ikon: "⛈️" };
  return { teks: "Tidak diketahui", ikon: "❓" };
}