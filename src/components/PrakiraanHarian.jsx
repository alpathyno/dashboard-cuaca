import { artiKodeCuaca } from "../utils/kodeCuaca";

function namaHari(tanggal, indeks) {
  if (indeks === 0) return "Hari ini";
  return new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
  });
}

export default function PrakiraanHarian({ data }) {
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
                <span className="min">{h.min}°</span>
                <span className="maks">{h.maks}°</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}