export const platformsFamilies = {
  playstation: [187, 18, 16, 15, 27, 26, 46], // PS5, PS4, PS3, PS2,PS1 , PSP
  xbox: [186, 1, 14, 80], // Xbox Series X/S, Xbox One, Xbox 360, Xbox Original
  pc: [4], // PC
  nintendo: [7, 8, 9, 13, 10, 11], // Switch, 3DS, DS, Wii U, Wii, GameCube
  mobile: [3, 21], // iOS, Android
};

export const getAllGamesByFamily = async (
  family?: keyof typeof platformsFamilies | number,
  specificPlatformId?: string | number,
) => {
  const API_KEY = "62416f1743174897bf64cba4dec77848";

  const ids = specificPlatformId
    ? specificPlatformId
    : typeof family === "number"
      ? family
      : family
        ? platformsFamilies[family].join(",")
        : "";

  const platforms = ids ? `&platforms=${ids}` : "";

  const promises = Array.from({ length: 20 }).map((_, i) =>
    fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}${platforms}&page_size=40&page=${i + 1}`,
    ).then((r) => r.json()),
  );

  const results = await Promise.all(promises);
  return results; // Return the array of response objects
};
