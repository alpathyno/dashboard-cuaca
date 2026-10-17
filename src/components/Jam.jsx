import { useEffect, useMemo, useState } from "react";

function buatFormat(locale, format, zona) {
  try {
    return new Intl.DateTimeFormat(locale, { ...format, timeZone: zona });
  } catch {
    // nama zona tidak dikenali browser: pakai zona perangkat
    return new Intl.DateTimeFormat(locale, format);
  }
}

export default function Jam({ zona, offsetDetik }) {
  const [sekarang, setSekarang] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setSekarang(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatWaktu = useMemo(
    () =>
      buatFormat(
        "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23",
        },
        zona,
      ),
    [zona],
  );
  const formatTanggal = useMemo(
    () =>
      buatFormat(
        "id-ID",
        { weekday: "long", day: "numeric", month: "long" },
        zona,
      ),
    [zona],
  );

  // Selisih jam kota ini dengan jam perangkat pengguna
  let keterangan = "";
  if (offsetDetik != null) {
    const offsetLokal = -sekarang.getTimezoneOffset() * 60;
    const selisih = (offsetDetik - offsetLokal) / 3600;
    if (selisih !== 0) {
      const angka = Number.isInteger(selisih) ? selisih : selisih.toFixed(1);
      keterangan = `${selisih > 0 ? "+" : ""}${angka} jam dari waktumu`;
    }
  }

  return (
    <div className="jam">
      <span className="jam-waktu">{formatWaktu.format(sekarang)}</span>
      <span className="jam-info">
        {formatTanggal.format(sekarang)}
        {keterangan && ` · ${keterangan}`}
      </span>
    </div>
  );
}
