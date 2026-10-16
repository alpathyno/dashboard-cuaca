import { useEffect, useState } from "react";
import { kategoriAQI } from "../utils/kategori";

export default function KualitasUdara({ lat, lon }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    async function ambil() {
      try {
        const url =
          `https://air-quality-api.open-meteo.com/v1/air-quality` +
          `?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10&timezone=auto`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Gagal");
        const json = await res.json();
        setData(json.current);
        setStatus("success");
      } catch (err) {
        if (err.name === "AbortError") return;
        setStatus("error");
      }
    }

    ambil();
    return () => controller.abort();
  }, [lat, lon]);

  if (status === "loading") {
    return (
      <div className="kartu lebar">
        <h3>Kualitas udara</h3>
        <div className="skel skel-teks" style={{ margin: "0.5rem 0", width: "60%" }} />
      </div>
    );
  }

  if (status === "error" || data?.us_aqi == null) {
    return (
      <div className="kartu lebar">
        <h3>Kualitas udara</h3>
        <p className="info-cari">Data kualitas udara tidak tersedia untuk lokasi ini.</p>
      </div>
    );
  }

  const aqi = Math.round(data.us_aqi);
  const kategori = kategoriAQI(aqi);
  const persen = Math.min(aqi / 300, 1) * 100; // bar mentok di 300

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