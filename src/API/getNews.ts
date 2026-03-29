const API_KEY = "a97bb24eb57246f4ad4a4c78e065683c";
// src/API/getNews.ts

export const getNews = async (
  topic: "all" | "gaming" | "hardware" | "esports" | "indie",
) => {
  const queries = {
    gaming: '("video games" OR "gaming console") NOT "gambling"',
    hardware: '("RTX" OR "Nvidia" OR "AMD Ryzen" OR "Intel Core")',
    esports: '("esports" OR "Valorant" OR "League of Legends")',
    indie: '("indie games" OR "independent developer" OR "itch.io")',
    // The "All" query combines the core terms of the others
    all: '("video games" OR "RTX" OR "esports" OR "indie games") NOT "gambling"',
  };

  const q = encodeURIComponent(queries[topic]);
  const url = `https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&language=en&pageSize=15&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.articles;
};
