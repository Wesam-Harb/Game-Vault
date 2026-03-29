import { getPlatforms } from "../API/getPlatforms";
import { useState, useEffect } from "react";
import type { Platforms } from "../Types/Platfroms";

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platforms | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPlatforms()
      .then((data) => setPlatforms(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []); // <--- This is the "Trigger"

  return { platforms, loading };
}
