export function kategoriUV(uv) {
  if (uv < 3) return { teks: "Rendah", warna: "#5fd068" };
  if (uv < 6) return { teks: "Sedang", warna: "#f5d142" };
  if (uv < 8) return { teks: "Tinggi", warna: "#ff9f1a" };
  if (uv < 11) return { teks: "Sangat tinggi", warna: "#ff5a4d" };
  return { teks: "Ekstrem", warna: "#b05cff" };
}

// Skala US AQI
export function kategoriAQI(aqi) {
  if (aqi <= 50) return { teks: "Baik", warna: "#5fd068" };
  if (aqi <= 100) return { teks: "Sedang", warna: "#f5d142" };
  if (aqi <= 150) return { teks: "Tidak sehat untuk kelompok sensitif", warna: "#ff9f1a" };
  if (aqi <= 200) return { teks: "Tidak sehat", warna: "#ff5a4d" };
  if (aqi <= 300) return { teks: "Sangat tidak sehat", warna: "#b05cff" };
  return { teks: "Berbahaya", warna: "#8c1c3a" };
}