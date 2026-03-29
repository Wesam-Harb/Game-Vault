export const getGamesDetails = async (id: string | undefined) => {
  const API_KEY = "62416f1743174897bf64cba4dec77848";
  const response = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${API_KEY}`,
  );
  if (response.ok) return await response.json();
  else return [];
};
