export function konversi(celsius, satuan) {
  return satuan === "F" ? (celsius * 9) / 5 + 32 : celsius;
}

export function formatSuhu(celsius, satuan) {
  return `${Math.round(konversi(celsius, satuan))}°${satuan}`;
}