import { kategoriAQI } from "../utils/kategori";

export default function KualitasUdara({ data }) {
  if (!data || data.us_aqi == null) {
    return (
      <div className="kartu lebar">
        <h3>Kualitas udara</h3>
        <p className="info-cari">Data kualitas udara tidak tersedia untuk lokasi ini.</p>
      </div>
    );
  }

  const aqi = Math.round(data.us_aqi);
  const kategori = kategoriAQI(aqi);
  const persen = Math.min(aqi / 300, 1) * 100;

  return (
    <div className="kartu lebar">
      <h3>Kualitas udara</h3>
      <div className="aqi-atas">
        <span className="aqi-angka" style={{ color: kategori.warna }}>{aqi}</span>
        <span className="aqi-teks">{kategori.teks}</span>
      </div>

      <div className="aqi-bar">
        <div className="aqi-penanda" style={{ left: `${persen}%` }} />
      </div>

      <div className="aqi-detail">
        <span>PM2.5: {data.pm2_5?.toFixed(1)} µg/m³</span>
        <span>PM10: {data.pm10?.toFixed(1)} µg/m³</span>
      </div>
    </div>
  );
}