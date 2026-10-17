export default function PenandaPembaruan({ waktu, menyegarkan, gagal, onSegarkan }) {
  if (!waktu) return null;

  const jam = new Date(waktu).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="pembaruan">
      <button
        className={`segarkan ${menyegarkan ? "putar" : ""}`}
        onClick={onSegarkan}
        disabled={menyegarkan}
        aria-label="Perbarui data cuaca"
        title="Perbarui sekarang"
      >
        ↻
      </button>
      <span className={gagal ? "gagal" : ""}>
        {gagal ? `Gagal memperbarui, data pukul ${jam}` : `Diperbarui ${jam}`}
      </span>
    </div>
  );
}