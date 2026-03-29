import { getLatestGames } from "../API/getGames";
import { useState, useEffect } from "react";
type Game = {
  id: number;
  name: string;
  rating: number;
  background_image: string;
};

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
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};
