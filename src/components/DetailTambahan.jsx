import { kategoriUV } from "../utils/kategori";

const jam = (iso) => iso.slice(11, 16); // "2026-10-16T05:52" -> "05:52"

export default function DetailTambahan({ current, daily }) {
  const uv = daily.uv_index_max[0];
  const kategori = kategoriUV(uv);

  const item = [
    {
      label: "Indeks UV (maks hari ini)",
      nilai: uv.toFixed(1),
      ket: kategori.teks,
      warna: kategori.warna,
    },
    {
      label: "Matahari terbit",
      nilai: jam(daily.sunrise[0]),
      ket: "waktu setempat",
    },
    {
      label: "Matahari terbenam",
      nilai: jam(daily.sunset[0]),
      ket: "waktu setempat",
    },
    {
      label: "Tekanan udara",
      nilai: `${Math.round(current.pressure_msl)} hPa`,
    },
    { label: "Tutupan awan", nilai: `${current.cloud_cover}%` },
  ];

  return (
    <div className="kartu lebar">
      <h3>Detail hari ini</h3>
      <div className="detail-grid">
        {item.map((d) => (
          <div className="detail-item" key={d.label}>
            <span className="d-label">{d.label}</span>
            <span className="d-nilai">{d.nilai}</span>
            {d.ket && (
              <span
                className="d-ket"
                style={d.warna ? { color: d.warna } : undefined}
              >
                {d.ket}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
