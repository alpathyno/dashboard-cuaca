import { artiKodeCuaca } from "../utils/kodeCuaca";

export default function CuacaSekarang({ kota, data }) {
  const kondisi = artiKodeCuaca(data.weather_code);

  return (
    <div className="kartu">
      <h2>{kota}</h2>
      <div className="ikon">{kondisi.ikon}</div>
      <div className="suhu">{Math.round(data.temperature_2m)}°C</div>
      <p className="kondisi">{kondisi.teks}</p>
      <div className="detail">
        <span>Terasa {Math.round(data.apparent_temperature)}°C</span>
        <span>Lembap {data.relative_humidity_2m}%</span>
        <span>Angin {data.wind_speed_10m} km/j</span>
      </div>
    </div>
  );
}