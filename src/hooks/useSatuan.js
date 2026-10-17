import { useEffect, useState } from "react";

const KUNCI = "dashboard-cuaca:satuan";

export function useSatuan() {
  const [satuan, setSatuan] = useState(() => {
    try {
      return localStorage.getItem(KUNCI) === "F" ? "F" : "C";
    } catch {
      return "C"; // localStorage bisa saja diblokir browser
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI, satuan);
    } catch {
      /* abaikan */
    }
  }, [satuan]);

  return [satuan, setSatuan];
}