const API_KEY = "pub_466fb0e5357b4ebaa7ae3813fb90b7d3";
// src/API/getNews.ts

export const getNews = async (
  topic: "all" | "hardware" | "esports" | "indie",
) => {
  const queries = {
    all: '"video games" OR "PlayStation" OR "Xbox"',
    hardware: '"Nvidia" OR "RTX" OR "AMD Ryzen"',
    esports: '"esports" OR "Valorant" OR "League NOT (sports OR football)"',
    indie: '"indie games" OR "itch.io"',
  };

  const q = encodeURIComponent(queries[topic]);
  const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&qInTitle=${q}&language=en&image=1&removeduplicate=1&size=10&excludecategory=sports`;

  const response = await fetch(url);
  const data = await response.json();

  return data.results;
};
