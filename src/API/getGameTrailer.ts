export const gameTrailer = async (name: string | undefined) => {
  try {
    const gbRes = await fetch(
      `https://api.gamebrain.co/v1/games?query=${name}&api-key=1dcb0665a5eb4bd2a5d0c2f4f7da4d7e`,
    );
    const gbData = await gbRes.json();

    const trailers = await fetch(
      `https://api.gamebrain.co/v1/games/${gbData.results[0].id}?api-key=1dcb0665a5eb4bd2a5d0c2f4f7da4d7e`,
    );
    return trailers.json();
  } catch {
    console.error("GameBrain trailer not found for this slug");
  }
};
