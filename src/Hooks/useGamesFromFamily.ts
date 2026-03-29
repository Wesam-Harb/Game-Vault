import {
  getAllGamesByFamily,
  platformsFamilies,
} from "../API/getGamesFromFamily";
import type { ResponseApi } from "../Types/Family";
import { useState, useEffect } from "react";

export default function useGamesFromFamily(
  family: keyof typeof platformsFamilies,
  specificPlatformSlug?: string, // Pass the slug from the URL here
) {
  const [data, setData] = useState<ResponseApi[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setData(null);
        setLoading(true);
      }
    }, 0);

    const fetchGames = async () => {
      try {
        const result = await getAllGamesByFamily(family, specificPlatformSlug);
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGames();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId); // Clean up the timeout if the user clicks fast
    };
  }, [family, specificPlatformSlug]); // Re-fetch whenever the platform changes!

  return { data, loading };
}
