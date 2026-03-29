import { getNews } from "../API/getNews";
import { useEffect, useState } from "react";

import type { ApiResponse } from "../Types/NewsType";

// If you want to store the whole array
export function useNews(
  categoryIndex: "gaming" | "hardware" | "esports" | "indie" | "all",
) {
  const [newsData, setNewsData] = useState<ApiResponse[] | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    getNews(categoryIndex)
      .then((data) => setNewsData(data))
      .catch((err) => console.error(err))
      .finally(() => setNewsLoading(false));
  }, [categoryIndex]); // <--- This is the "Trigger"

  return { newsData, newsLoading };
}
