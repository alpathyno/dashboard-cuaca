import { useCallback, useEffect, useRef, useState } from "react";
import CuacaSekarang from "./components/CuacaSekarang";
import CuacaSkeleton from "./components/CuacaSkeleton";
import CariKota from "./components/CariKota";
import TombolSatuan from "./components/TombolSatuan";
import PenandaPembaruan from "./components/PenandaPembaruan";
import PrakiraanPerJam from "./components/PrakiraanPerJam";
import PrakiraanHarian from "./components/PrakiraanHarian";
import DetailTambahan from "./components/DetailTambahan";
import KualitasUdara from "./components/KualitasUdara";
import LatarCuaca from "./components/LatarCuaca";
import { ambilPerJam, ambilHarian } from "./utils/olahPrakiraan";
import { pilihTema } from "./utils/temaCuaca";
import { bacaCache, tulisCache, kunciLokasi, UMUR_SEGAR } from "./utils/cache";
import { useSatuan } from "./hooks/useSatuan";
import "./App.css";

const KOTA_DEFAULT = { nama: "Palembang", lat: -2.9761, lon: 104.7754 };
const INTERVAL_REFRESH = UMUR_SEGAR; // perbarui otomatis tiap 10 menit

async function ambilJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Server membalas dengan status ${res.status}`);
  return res.json();
}

export default function App() {
  const [kota, setKota] = useState(KOTA_DEFAULT);
  const [cuaca, setCuaca] = useState(null);
  const [udara, setUdara] = useState(null);
  const [status, setStatus] = useState("loading");
  const [pesanError, setPesanError] = useState("");
  const [diperbarui, setDiperbarui] = useState(null); // waktu data terakhir (ms)
  const [menyegarkan, setMenyegarkan] = useState(false);
  const [gagalSenyap, setGagalSenyap] = useState(false);
  const [satuan, setSatuan] = useSatuan();
  const idPermintaan = useRef(0);

  // senyap = true: perbarui di belakang layar, tanpa skeleton dan tanpa layar error
  const ambilCuaca = useCallback(
    async ({ senyap = false } = {}) => {
      const id = ++idPermintaan.current;
      if (senyap) setMenyegarkan(true);
      else setStatus("loading");

      try {
        const urlCuaca =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${kota.lat}&longitude=${kota.lon}` +
          `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,pressure_msl,cloud_cover,is_day` +
          `&hourly=temperature_2m,precipitation_probability` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset` +
          `&forecast_days=7&timezone=auto`;
        const urlUdara =
          `https://air-quality-api.open-meteo.com/v1/air-quality` +
          `?latitude=${kota.lat}&longitude=${kota.lon}&current=us_aqi,pm2_5,pm10&timezone=auto`;

        // allSettled: kalau satu gagal, yang lain tetap dipakai
        const [hasilCuaca, hasilUdara] = await Promise.allSettled([
          ambilJson(urlCuaca),
          ambilJson(urlUdara),
        ]);

        if (id !== idPermintaan.current) return; // ada permintaan yang lebih baru
        if (hasilCuaca.status === "rejected") throw hasilCuaca.reason;

        const kunci = kunciLokasi("cuaca", kota.lat, kota.lon);
        const udaraBaru =
          hasilUdara.status === "fulfilled"
            ? (hasilUdara.value.current ?? null)
            : null;
        // pada refresh senyap, kalau AQI gagal, pertahankan nilai terakhir yang tersimpan
        const udaraAkhir =
          udaraBaru ??
          (senyap ? (bacaCache(kunci)?.data?.udara ?? null) : null);

        tulisCache(kunci, { cuaca: hasilCuaca.value, udara: udaraAkhir });
        setCuaca(hasilCuaca.value);
        setUdara(udaraAkhir);
        setDiperbarui(Date.now());
        setGagalSenyap(false);
        setStatus("success");
      } catch (err) {
        if (id !== idPermintaan.current) return;
        if (senyap) {
          setGagalSenyap(true); // data lama tetap tampil
        } else {
          setPesanError(err.message);
          setStatus("error");
        }
      } finally {
        if (id === idPermintaan.current) setMenyegarkan(false);
      }
    },
    [kota],
  );

  // Saat kota berubah: pakai cache kalau ada, lalu perbarui bila sudah basi
  useEffect(() => {
    idPermintaan.current += 1; // batalkan hasil permintaan kota sebelumnya
    setMenyegarkan(false);
    setGagalSenyap(false);

    const simpanan = bacaCache(kunciLokasi("cuaca", kota.lat, kota.lon));
    if (simpanan) {
      setCuaca(simpanan.data.cuaca);
      setUdara(simpanan.data.udara);
      setDiperbarui(simpanan.waktu);
      setStatus("success");
      if (Date.now() - simpanan.waktu > UMUR_SEGAR)
        ambilCuaca({ senyap: true });
    } else {
      ambilCuaca();
    }
  }, [kota, ambilCuaca]);

  // Perbarui otomatis berkala (hanya saat tab sedang dilihat)
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") ambilCuaca({ senyap: true });
    }, INTERVAL_REFRESH);
    return () => clearInterval(timer);
  }, [ambilCuaca]);

  // Saat kembali ke tab dan datanya sudah basi, perbarui langsung
  useEffect(() => {
    function saatKembali() {
      if (
        document.visibilityState === "visible" &&
        diperbarui &&
        Date.now() - diperbarui > UMUR_SEGAR
      ) {
        ambilCuaca({ senyap: true });
      }
    }
    document.addEventListener("visibilitychange", saatKembali);
    return () => document.removeEventListener("visibilitychange", saatKembali);
  }, [ambilCuaca, diperbarui]);

  const tema = cuaca
    ? pilihTema(cuaca.current.weather_code, cuaca.current.is_day === 1)
    : "cerah-siang";

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
  }, [tema]);

  return (
    <>
      <LatarCuaca tema={tema} />

      <main>
        <div className="atas">
          <CariKota onPilih={setKota} />
          <TombolSatuan satuan={satuan} onUbah={setSatuan} />
          <PenandaPembaruan
            waktu={status === "success" ? diperbarui : null}
            menyegarkan={menyegarkan}
            gagal={gagalSenyap}
            onSegarkan={() => ambilCuaca({ senyap: true })}
          />
        </div>

        {status === "loading" && (
          <div className="area-penuh">
            <CuacaSkeleton />
          </div>
        )}

        {status === "error" && (
          <div className="area-penuh">
            <div className="kartu error">
              <div className="ikon">⚠️</div>
              <p>Gagal memuat data cuaca.</p>
              <p className="pesan-error">{pesanError}</p>
              <button onClick={() => ambilCuaca()}>Coba lagi</button>
            </div>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="sel s-sekarang">
              <CuacaSekarang
                kota={kota.nama}
                data={cuaca.current}
                satuan={satuan}
                zona={cuaca.timezone}
                offsetDetik={cuaca.utc_offset_seconds}
              />
            </div>
            <div className="sel s-jam">
              <PrakiraanPerJam
                data={ambilPerJam(cuaca.hourly, cuaca.current.time)}
                satuan={satuan}
              />
            </div>
            <div className="sel s-harian">
              <PrakiraanHarian
                data={ambilHarian(cuaca.daily)}
                satuan={satuan}
              />
            </div>
            <div className="sel s-detail">
              <DetailTambahan current={cuaca.current} daily={cuaca.daily} />
            </div>
            <div className="sel s-udara">
              <KualitasUdara data={udara} />
            </div>
          </>
        )}
        <a
          className="kredit"
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
        >
          Data cuaca oleh Open-Meteo.com
        </a>
      </main>
    </>
  );
}
