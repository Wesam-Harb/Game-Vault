import { useState, useEffect } from "react";
import { getGamesDetails } from "../API/getGameDetails";
import { getGameScreens } from "../API/getGameScreens";
import { gameTrailer } from "../API/getGameTrailer";
import type { GameDetails } from "../Types/GameDetails";

export interface Screen {
  results: { id: number; image: string }[];
}

export default function useGamesDetails(id: string | undefined) {
  const [data, setData] = useState<GameDetails | null>(null);
  const [screens, setScreens] = useState<Screen | null>(null);
  const [trailer, setTrailer] = useState<{ videos: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let isCancelled = false;

    // Reset loading state for the new ID
    // Using a microtask (Promise) prevents the "synchronous setState" warning
    Promise.resolve().then(() => {
      if (!isCancelled) {
        setLoading(true);
      }
    });

    // 1. Fetch main details
    getGamesDetails(id)
      .then((gameData) => {
        if (isCancelled) return;
        setData(gameData);

        // 2. Fetch trailer using the name from the fresh gameData
        const cleanName = gameData.name.replace(/[()]/g, "");
        return gameTrailer(cleanName);
      })
      .then((trailerData) => {
        if (!isCancelled && trailerData) {
          setTrailer(trailerData);
        }
      })
      .catch((err) =>
        console.error("Error fetching game details/trailer:", err),
      )
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    // 3. Fetch screenshots in parallel
    getGameScreens(id)
      .then((screenData) => {
        if (!isCancelled) setScreens(screenData);
      })
      .catch((err) => console.error("Error fetching screens:", err));

    // CLEANUP: This runs when 'id' changes or component unmounts
    return () => {
      isCancelled = true;
      setData(null);
      setScreens(null);
      setTrailer(null);
    };
  }, [id]);

  return { data, screens, loading, trailer };
}
