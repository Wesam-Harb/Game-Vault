import { useState, useEffect } from "react";
import { getGamesFilters } from "../API/getGames";
import type { GameDetails } from "../Types/GameDetails";
import type { Game } from "../Types/Game"; // Import the basic Game type

export function useSimilarGames(currentGame: GameDetails | null) {
  const [similar, setSimilar] = useState<Game[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState<boolean>(true);

  useEffect(() => {
    if (!currentGame) return;
    const genreIds = currentGame.genres.map((g) => g.id).join(",");

    getGamesFilters(genreIds)
      .then((response) => {
        const filtered = response.results.filter((game: Game) => {
          return Number(game.id) !== Number(currentGame.id);
        });

        setSimilar(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingSimilar(false));
  }, [currentGame]);

  return { similar, loadingSimilar };
}
