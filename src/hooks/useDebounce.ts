import { useEffect, useState } from "react";

export function useDebounce<K>(value: K, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<K>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
