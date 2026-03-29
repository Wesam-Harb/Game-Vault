const API_KEY = "key=62416f1743174897bf64cba4dec77848";

import type { Game } from "../Types/Game";

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
};

const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Pads with a leading zero if needed
const day = today.getDate().toString().padStart(2, "0"); // Pads with a leading zero if needed

const currentDate = `${year}-${month}-${day}`;

today.setMonth(today.getMonth() - 3);
const PYear = today.getFullYear();
const PMonth = String(today.getMonth() + 1).padStart(2, "0");
const PDay = String(today.getDate()).padStart(2, "0");

const dateMinusThreeMonths = `${PYear}-${PMonth}-${PDay}`;

export const getGames = async (params?: {
  ordering?: string;
  platform?: string;
  pageSize?: string;
  dates?: string;
  genres?: string;
}): Promise<ApiResponse> => {
  let url = `https://api.rawg.io/api/games?${API_KEY}`;
  if (params?.ordering) url += `&ordering=${params.ordering}`;
  if (params?.platform) url += `&platform=${params.platform}`;
  if (params?.pageSize) url += `&page_size=${params.pageSize}`;
  if (params?.dates) url += `&dates=${dateMinusThreeMonths},${currentDate}`;
  if (params?.genres) url += `&genres=${params.genres}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const getTopRatedGames = () =>
  getGames({ ordering: "-metacritic,-added", pageSize: "20" });

export const getLatestGames = () =>
  getGames({ ordering: "-rating", pageSize: "3", dates: "true" });

export const getGamesByPlatform = (platform: string) => getGames({ platform });

export const getGamesFilters = (genres: string | undefined) =>
  getGames({ genres });
