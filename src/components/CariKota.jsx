import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

export default function CariKota({ onPilih }) {
  const [input, setInput] = useState("");
  const [saran, setSaran] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | empty | error
  const query = useDebounce(input.trim(), 400);

  useEffect(() => {
    if (query.length < 2) {
      setSaran([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();

    async function cari() {
      setStatus("loading");
      try {
        const url =
          `https://geocoding-api.open-meteo.com/v1/search` +
          `?name=${encodeURIComponent(query)}&count=5&language=id&format=json`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Gagal mencari kota");

        const data = await res.json();
        const hasil = data.results ?? []; // jika tidak ketemu, properti results tidak ada
        setSaran(hasil);
        setStatus(hasil.length === 0 ? "empty" : "idle");
      } catch (err) {
        if (err.name === "AbortError") return; // dibatalkan sengaja, bukan error
        setStatus("error");
      }
    }

    cari();
    return () => controller.abort(); // batalkan request lama saat query berubah
  }, [query]);

  function pilih(k) {
    onPilih({ nama: k.name, lat: k.latitude, lon: k.longitude });
    setInput("");
    setSaran([]);
    setStatus("idle");
  }

  return (
    <div className="cari">
      <input
        type="text"
        placeholder="Cari kota..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && saran[0] && pilih(saran[0])}
      />

      {status === "loading" && <div className="info-cari">Mencari...</div>}
      {status === "empty" && <div className="info-cari">Kota tidak ditemukan</div>}
      {status === "error" && <div className="info-cari">Gagal mencari, coba lagi</div>}

      {saran.length > 0 && (
        <ul className="saran">
          {saran.map((k) => (
            <li key={k.id} onClick={() => pilih(k)}>
              <strong>{k.name}</strong>
              <span>{[k.admin1, k.country].filter(Boolean).join(", ")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}