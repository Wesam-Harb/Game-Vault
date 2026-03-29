import type { FamilyApi } from "../Types/Family";
import { motion } from "framer-motion";

import { PreviewMedia } from "./previewMedia";
import type { Game } from "../Types/Game";

export const GameTooltip = ({
  game,
  tooltipSide,
  coords, // Add this prop
}: {
  game: FamilyApi | Game;
  tooltipSide: "left" | "right";
  coords: { top: number; left: number; right: number };
}) => {
  // Calculate horizontal position based on side
  const horizontalPos =
    tooltipSide === "right"
      ? coords.right + 15 // 15px gap from card
      : coords.left - 335; // tooltip width (320) + gap

  return (
    <motion.div
      initial={{ opacity: 0, x: tooltipSide === "right" ? 10 : -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute", // Relative to <body> because of Portal
        top: coords.top,
        left: horizontalPos,
        zIndex: 9999,
      }}
      className="w-[320px] bg-[#dbe2e6] text-[#333] rounded shadow-2xl p-4 pointer-events-none"
    >
      {/* The Arrow */}
      <div
        className={`absolute top-10 w-0 h-0 border-y-8 border-y-transparent 
          ${
            tooltipSide === "right"
              ? "right-full border-r-8 border-r-[#dbe2e6]"
              : "left-full border-l-8 border-l-[#dbe2e6]"
          }`}
      />
      <h3 className="text-xl font-bold text-[#1a1a1a] leading-tight mb-1">
        {game?.name}
      </h3>
      <p className="text-xs text-gray-500 mb-3">Released: {game?.released}</p>
      <PreviewMedia key={game?.id} gameName={game?.slug} />
      <div className="mt-4">
        <div className="bg-[#b8c5cc] p-2 rounded text-xs">
          <p className="text-[#4c6c7c] font-bold uppercase text-[10px] mb-1">
            Overall User Reviews
          </p>
          <span className="text-[#4c677c] font-medium">Mixed </span>
          <span className="text-[#8896a1]">{game?.ratings_count}</span>
        </div>
        <div className="mt-4">
          <p className="text-[#4c6c7c] font-bold uppercase text-[10px] mb-2">
            User tags:
          </p>

          <div className="flex flex-wrap gap-1">
            {game?.tags
              .filter((tag) => tag.language === "eng")
              .slice(0, 4)
              .map((tag) => (
                <span
                  key={tag.id}
                  className="bg-[#b8c5cc] text-[#4c6c7c] px-2 py-0.5 rounded text-[11px]"
                >
                  {tag.name}
                </span>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
