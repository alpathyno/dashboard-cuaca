import { artiKodeCuaca } from "../utils/kodeCuaca";
import { konversi } from "../utils/satuan";

function namaHari(tanggal, indeks) {
  if (indeks === 0) return "Hari ini";
  return new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
  });
}

export default function PrakiraanHarian({ data, satuan }) {
  return (
    <div className="kartu lebar">
      <h3>7 hari ke depan</h3>
      <ul className="harian">
        {data.map((h, i) => {
          const kondisi = artiKodeCuaca(h.kode);
          return (
            <li key={h.tanggal}>
              <span className="hari">{namaHari(h.tanggal, i)}</span>
              <span className="ikon-kecil" title={kondisi.teks}>
                {kondisi.ikon}
              </span>
              <span className="hujan">💧 {h.hujan ?? 0}%</span>
              <span className="rentang">
                <span className="min">
                  {Math.round(konversi(h.min, satuan))}°
                </span>
                <span className="maks">
                  {Math.round(konversi(h.maks, satuan))}°
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
