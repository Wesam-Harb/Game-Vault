import { getLatestGames } from "../API/getGames";
import { useState, useEffect } from "react";
import type { Game } from "../Types/Game";

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
};

export const useLatestGames = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getLatestGames()
      .then((response) => setData(response))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};
