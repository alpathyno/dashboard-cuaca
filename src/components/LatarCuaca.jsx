const acak = (min, max) => Math.random() * (max - min) + min;

const SERPIHAN = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  kiri: acak(0, 100),
  ukuran: acak(3, 8),
  durasi: acak(7, 16),
  tunda: -acak(0, 16),
  op: acak(0.5, 0.95),
  ayun: acak(-60, 60), // seberapa jauh serpihan bergeser ke samping
}));

// Nilai acak dibuat SEKALI saat file dimuat, supaya posisi tidak berubah tiap render
const TETES = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  kiri: acak(0, 115),
  tinggi: acak(50, 110),
  durasi: acak(0.6, 1.1),
  tunda: -acak(0, 2), // delay negatif: animasi sudah "berjalan" saat halaman dibuka
  op: acak(0.25, 0.6),
}));

const BINTANG = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  kiri: acak(0, 100),
  atas: acak(0, 75),
  ukuran: acak(1, 3),
  durasi: acak(2, 5),
  tunda: -acak(0, 5),
}));

const AWAN = Array.from({ length: 8 }, (_, i) => {
  const lebar = acak(220, 420);
  const durasi = acak(70, 150);
  return {
    id: i,
    atas: acak(2, 55),
    lebar,
    tinggi: lebar * 0.22,
    durasi,
    tunda: -acak(0, durasi),
    op: acak(0.6, 1),
  };
});

const KABUT = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  atas: acak(5, 60),
  durasi: acak(18, 34),
  tunda: -acak(0, 20),
}));

const JUMLAH_AWAN = {
  "cerah-siang": 3,
  "berawan-siang": 8,
  "berawan-malam": 7,
  hujan: 5,
  petir: 5,
  salju: 4,
};

export default function LatarCuaca({ tema }) {
  const jumlahAwan = JUMLAH_AWAN[tema] ?? 0;
  const jumlahTetes = tema === "hujan" ? 90 : tema === "petir" ? 110 : 0;

  return (
    <div className="latar" aria-hidden="true">
      {tema === "cerah-siang" && <div className="matahari" />}

      {tema === "cerah-malam" && (
        <>
          <div className="bulan" />
          {BINTANG.map((b) => (
            <div
              key={b.id}
              className="bintang"
              style={{
                left: `${b.kiri}%`,
                top: `${b.atas}%`,
                width: b.ukuran,
                height: b.ukuran,
                animationDuration: `${b.durasi}s`,
                animationDelay: `${b.tunda}s`,
              }}
            />
          ))}
        </>
      )}

      {AWAN.slice(0, jumlahAwan).map((a) => (
        <div
          key={a.id}
          className="awan"
          style={{
            top: `${a.atas}%`,
            width: a.lebar,
            height: a.tinggi,
            opacity: a.op,
            animationDuration: `${a.durasi}s`,
            animationDelay: `${a.tunda}s`,
          }}
        />
      ))}

      {tema === "kabut" &&
        KABUT.map((k) => (
          <div
            key={k.id}
            className="kabut"
            style={{
              top: `${k.atas}%`,
              animationDuration: `${k.durasi}s`,
              animationDelay: `${k.tunda}s`,
            }}
          />
        ))}

      {TETES.slice(0, jumlahTetes).map((t) => (
        <div
          key={t.id}
          className="tetes"
          style={{
            left: `${t.kiri}%`,
            height: t.tinggi,
            opacity: t.op,
            animationDuration: `${t.durasi}s`,
            animationDelay: `${t.tunda}s`,
          }}
        />
      ))}

      {tema === "salju" &&
        SERPIHAN.map((s) => (
          <div
            key={s.id}
            className="serpihan"
            style={{
              left: `${s.kiri}%`,
              width: s.ukuran,
              height: s.ukuran,
              opacity: s.op,
              animationDuration: `${s.durasi}s`,
              animationDelay: `${s.tunda}s`,
              "--ayun": `${s.ayun}px`,
            }}
          />
        ))}
      {tema === "petir" && <div className="kilat" />}
    </div>
  );
}
