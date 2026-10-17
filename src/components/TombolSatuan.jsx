export default function TombolSatuan({ satuan, onUbah }) {
  return (
    <div className="satuan" role="group" aria-label="Satuan suhu">
      {["C", "F"].map((s) => (
        <button
          key={s}
          className={s === satuan ? "aktif" : ""}
          onClick={() => onUbah(s)}
          aria-pressed={s === satuan}
        >
          °{s}
        </button>
      ))}
    </div>
  );
}