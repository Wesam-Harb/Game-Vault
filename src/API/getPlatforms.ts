export const getPlatforms = async () => {
  const API_KEY = "62416f1743174897bf64cba4dec77848";
  const response = await fetch(
    `https://api.rawg.io/api/platforms/lists/parents?key=${API_KEY}`,
  );
  if (response.ok) return await response.json();
  else return [];
};
