import type { ApiResponse } from "../Types/NewsType";

export const getNews = async (
  categoryIndex?: number,
): Promise<ApiResponse[]> => {
  const urls = [
    "https://rss.app/feeds/v1.1/t5w9PcVipv724SzW.json", // Index 0: Gaming
    "https://rss.app/feeds/v1.1/tGvg3bYVUIhHKgsw.json", // Index 1: Indie
    "https://rss.app/feeds/v1.1/thqoQ851Ssr3YxM2.json", // Index 2: E-Sports
    "https://rss.app/feeds/v1.1/tMOXF2tu1vC1lCmV.json", // Index 3: Hardware
  ];

  // If a category index is passed, only fetch that one URL
  if (categoryIndex !== undefined && urls[categoryIndex]) {
    const res = await fetch(urls[categoryIndex]);
    const data = await res.json();
    return [data]; // Return as an array so the rest of your code stays the same
  }

  // Otherwise, fetch all (your original logic)
  return Promise.all(urls.map((url) => fetch(url).then((r) => r.json())));
};
