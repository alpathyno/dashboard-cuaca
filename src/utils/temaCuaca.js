export function pilihTema(kode, siang) {
  if (kode >= 95) return "petir";
  if (kode === 45 || kode === 48) return "kabut";
  if ((kode >= 51 && kode <= 67) || (kode >= 80 && kode <= 82)) return "hujan";
  if ((kode >= 71 && kode <= 77) || kode === 85 || kode === 86) return "salju";
  if (kode <= 1) return siang ? "cerah-siang" : "cerah-malam";
  return siang ? "berawan-siang" : "berawan-malam";
}