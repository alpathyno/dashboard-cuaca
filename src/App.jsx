import { useCallback, useEffect, useRef, useState } from "react";
import CuacaSekarang from "./components/CuacaSekarang";
import CuacaSkeleton from "./components/CuacaSkeleton";
import CariKota from "./components/CariKota";
import PrakiraanPerJam from "./components/PrakiraanPerJam";
import PrakiraanHarian from "./components/PrakiraanHarian";
import { ambilPerJam, ambilHarian } from "./utils/olahPrakiraan";
import DetailTambahan from "./components/DetailTambahan";
import KualitasUdara from "./components/KualitasUdara";
import "./App.css";

const KOTA_DEFAULT = { nama: "Palembang", lat: -2.9761, lon: 104.7754 };

export default function App() {
  const [kota, setKota] = useState(KOTA_DEFAULT);
  const [cuaca, setCuaca] = useState(null);
  const [status, setStatus] = useState("loading");
  const [pesanError, setPesanError] = useState("");
  const idPermintaan = useRef(0);

  const ambilCuaca = useCallback(async () => {
    const id = ++idPermintaan.current;
    setStatus("loading");
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${kota.lat}&longitude=${kota.lon}` +
       `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,pressure_msl,cloud_cover` +
        `&hourly=temperature_2m,precipitation_probability` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset` +
        `&forecast_days=7&timezone=auto`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server membalas dengan status ${res.status}`);
      const data = await res.json();

      if (id !== idPermintaan.current) return;
      setCuaca(data); // simpan seluruh respons: current, hourly, daily
      setStatus("success");
    } catch (err) {
      if (id !== idPermintaan.current) return;
      setPesanError(err.message);
      setStatus("error");
    }
  }, [kota]);

  useEffect(() => {
    ambilCuaca();
  }, [ambilCuaca]);

  return (
    <main>
      <CariKota onPilih={setKota} />

      {status === "loading" && <CuacaSkeleton />}

      {status === "error" && (
        <div className="kartu error">
          <div className="ikon">⚠️</div>
          <p>Gagal memuat data cuaca.</p>
          <p className="pesan-error">{pesanError}</p>
          <button onClick={ambilCuaca}>Coba lagi</button>
        </div>
      )}

      {status === "success" && (
        <>
          <CuacaSekarang kota={kota.nama} data={cuaca.current} />
          <PrakiraanPerJam data={ambilPerJam(cuaca.hourly, cuaca.current.time)} />
          <PrakiraanHarian data={ambilHarian(cuaca.daily)} />
          <DetailTambahan current={cuaca.current} daily={cuaca.daily} />
          <KualitasUdara lat={kota.lat} lon={kota.lon} />
        </>
      )}
    </main>
  );
}