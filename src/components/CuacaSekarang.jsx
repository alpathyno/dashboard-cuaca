import { artiKodeCuaca } from "../utils/kodeCuaca";
import { formatSuhu } from "../utils/satuan";
import Jam from "./Jam";

export default function CuacaSekarang({
  kota,
  data,
  satuan,
  zona,
  offsetDetik,
}) {
  const kondisi = artiKodeCuaca(data.weather_code);

  return (
    <div className="kartu">
      <h2>{kota}</h2>
      <Jam zona={zona} offsetDetik={offsetDetik} />

      <div className="baris-suhu">
        <div className="ikon">{kondisi.ikon}</div>
        <div className="suhu">{formatSuhu(data.temperature_2m, satuan)}</div>
      </div>
      <p className="kondisi">{kondisi.teks}</p>

      <div className="detail">
        <span>Terasa {formatSuhu(data.apparent_temperature, satuan)}</span>
        <span>Lembap {data.relative_humidity_2m}%</span>
        <span>Angin {data.wind_speed_10m} km/j</span>
      </div>
    </div>
  );
}
