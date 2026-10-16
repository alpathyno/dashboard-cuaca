import { useEffect, useState } from "react";

export function useDebounce(nilai, delay = 400) {
  const [nilaiTunda, setNilaiTunda] = useState(nilai);

  useEffect(() => {
    const timer = setTimeout(() => setNilaiTunda(nilai), delay);
    return () => clearTimeout(timer); // batalkan timer lama jika user masih mengetik
  }, [nilai, delay]);

  return nilaiTunda;
}