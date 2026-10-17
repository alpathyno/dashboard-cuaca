export function ambilPerJam(hourly, waktuSekarang, jumlah = 24) {
  const jamIni = waktuSekarang.slice(0, 13); // contoh: "2026-10-17T14"
  let mulai = hourly.time.findIndex((t) => t.slice(0, 13) === jamIni);
  if (mulai === -1) mulai = 0;

  return hourly.time.slice(mulai, mulai + jumlah).map((t, i) => ({
    jam: t.slice(11, 16),
    suhu: hourly.temperature_2m[mulai + i],
    hujan: hourly.precipitation_probability[mulai + i],
  }));
}

export function ambilHarian(daily) {
  return daily.time.map((tanggal, i) => ({
    tanggal,
    kode: daily.weather_code[i],
    maks: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    hujan: daily.precipitation_probability_max[i],
  }));
}