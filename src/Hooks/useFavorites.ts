import { useState, useEffect } from "react";
import type { GameDetails } from "../Types/GameDetails";

export const useFavorites = () => {
  // Change state type to just GameDetails[] (remove | null)
  const [favorites, setFavorites] = useState<GameDetails[]>(() => {
    const saved = localStorage.getItem("game-vault-favs");
    // Default to [] if null or undefined
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("game-vault-favs", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (game: GameDetails | null) => {
    // 1. Guard clause: if data is null (still loading), do nothing
    if (!game) return;

    setFavorites((prev) => {
      const isExist = prev.some((g) => g.id === game.id);
      if (isExist) return prev;
      return [...prev, game];
    });
  };

  const removeFavorite = (id: number) => {
    // prev is now guaranteed to be an array
    setFavorites((prev) => prev.filter((g) => g.id !== id));
  };

  const isFavorite = (id: number) => favorites.some((g) => g.id === id);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
