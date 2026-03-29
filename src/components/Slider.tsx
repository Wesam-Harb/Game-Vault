import { useState } from "react";
import { useTopRatedGames } from "../Hooks/useTopRatedGames";
import { AnimatePresence } from "framer-motion";
import { GameTooltip } from "./GameTooltip";
import type { Game } from "../Types/Game";
import type { FamilyApi } from "../Types/Family";
import { useIsMobile } from "../Hooks/useIsMobile";

//MUI icons
import StarRateIcon from "@mui/icons-material/StarRate";

//MUI components
import { Skeleton } from "@mui/material";

//react router
import { Link } from "react-router";
import { createPortal } from "react-dom";

import { motion } from "framer-motion";

function GamePortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}

export function Slider() {
  const isMobile = useIsMobile();
  const { data, loading } = useTopRatedGames();

  const itemsPerPage = 4;
  const totalPages = Math.ceil((data?.results.length ?? 0) / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(0);
  const [, setDirection] = useState(1);

  const start = currentPage * itemsPerPage;
  const visibleItems = data?.results.slice(start, start + itemsPerPage) ?? [];

  const leftItems = visibleItems.slice(0, 2);
  const rightItems = visibleItems.slice(2, 4);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    right: number;
  } | null>(null);
  const [tooltipSide, setTooltipSide] = useState<"left" | "right">("right");
  const [hoveredGame, setHoveredGame] = useState<FamilyApi | Game | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, game: FamilyApi | Game) => {
    const cardRect = e.currentTarget.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const tooltipWidth = 340;

    // Determine Side
    if (cardRect.right + tooltipWidth > screenWidth) {
      setTooltipSide("left");
    } else {
      setTooltipSide("right");
    }

    // Store coordinates (adding window.scrollY ensures it stays put if you scroll)
    setCoords({
      top: cardRect.top + window.scrollY,
      left: cardRect.left,
      right: cardRect.right,
    });
    setHoveredGame(game);
  };

  // Helper to handle direction when clicking dots
  const goToPage = (pageIndex: number) => {
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
  };

  const nextSlide = () => {
    if (!data?.results) return;
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    if (!data?.results) return;
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // 1. LOADING UI
  if (loading) {
    return (
      <div className="flex flex-col items-center w-full px-4 lg:px-0">
        <div className="flex items-center w-full gap-2">
          {/* Left Arrow - Hidden on mobile */}
          <div className="hidden lg:block">
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ bgcolor: "grey.900" }}
            />
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* LEFT SIDE (2 Large Vertical Cards) */}
            <div className="flex flex-col sm:flex-row gap-4 lg:flex-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex-1 bg-game-card rounded-xl border border-gray-800 p-0 overflow-hidden"
                >
                  {/* 1. The Image Rectangle */}
                  <Skeleton
                    variant="rectangular"
                    className="h-48 sm:h-64"
                    sx={{ bgcolor: "grey.900", width: "100%" }}
                  />
                  {/* 2. The Text Content Area */}
                  <div className="p-4">
                    <Skeleton
                      width="80%"
                      height={24}
                      sx={{ bgcolor: "grey.900" }}
                    />

                    <Skeleton
                      width="30%"
                      height={20}
                      sx={{ bgcolor: "grey.900" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE (2 Small Horizontal Cards) */}
            <div className="flex flex-col gap-4 lg:flex-1">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex bg-[#1b2838] rounded-xl overflow-hidden h-24 lg:flex-1"
                >
                  {/* 1. Small Image Rectangle (Left) */}
                  <Skeleton
                    variant="rectangular"
                    width={112} // Matches w-28
                    height="100%"
                    sx={{ bgcolor: "grey.900" }}
                  />
                  {/* 2. Small Text Area (Right) */}
                  <div className="p-3 flex-1 flex flex-col justify-center">
                    <Skeleton
                      width="70%"
                      height={20}
                      sx={{ bgcolor: "grey.900" }}
                    />

                    <Skeleton
                      width="25%"
                      height={16}
                      sx={{ bgcolor: "grey.900" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow - Hidden on mobile */}
          <div className="hidden lg:block">
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ bgcolor: "grey.900" }}
            />
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex gap-3 mt-8">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="circular"
              width={10}
              height={10}
              sx={{ bgcolor: "grey.800" }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative w-full">
      <div className="flex items-center w-full">
        {/* LEFT BUTTON - Hide on mobile if you prefer touch swiping */}
        <button
          className="hidden md:block p-3 mr-2 rounded-full bg-black/40 border border-white/10 hover:bg-blue-600 transition-colors z-20"
          onClick={prevSlide}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
        <motion.div
          // 1. Logic remains the same
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, { offset }) => {
            if (!isMobile) return;
            const swipeThreshold = 50;
            if (offset.x < -swipeThreshold) nextSlide();
            else if (offset.x > swipeThreshold) prevSlide();
          }}
          // 2. Conditional CSS Classes
          className={`
    w-full touch-pan-y 
    ${isMobile ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
  `}
        >
          <div className="relative flex-1">
            <div className="w-full">
              {/* Change flex-col (mobile) to flex-row (desktop) */}
              <div className="flex flex-col lg:flex-row gap-6 pb-6">
                {/* LEFT SIDE (Large Cards) */}
                {/* On mobile: takes full width. On desktop: takes 2/3 space */}
                <div className="flex flex-col sm:flex-row gap-4 lg:flex-2">
                  {leftItems.map((game) => (
                    <Link
                      to={`/gameDetail/${game.id}`}
                      key={game.id}
                      className="flex-1"
                    >
                      <div
                        className="relative bg-game-card rounded-xl border border-gray-800 group cursor-pointer overflow-hidden"
                        onMouseEnter={(e) =>
                          !isMobile && handleMouseEnter(e, game)
                        }
                        onMouseLeave={() => setHoveredGame(null)}
                      >
                        <div className="overflow-hidden">
                          <img
                            src={game.background_image}
                            className="w-full h-48 max-sm:h-40 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-lg font-semibold truncate">
                            {game.name}
                          </p>
                          <div className="mt-2 text-yellow-400 flex items-center font-bold">
                            <StarRateIcon />
                            {(game.metacritic / 10).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* RIGHT SIDE (Small Horizontal Cards) */}
                {/* On mobile: stack below. On desktop: stack vertically next to big cards */}
                <div className="flex flex-col gap-4 lg:flex-1 justify-between">
                  {rightItems.map((game) => (
                    <Link
                      key={game.id}
                      to={`gameDetail/${game.id}`}
                      className="bg-[#1b2838] h-24 sm:h-auto flex-1 text-white rounded-xl flex group cursor-pointer relative overflow-hidden"
                    >
                      <div
                        onMouseEnter={(e) =>
                          !isMobile && handleMouseEnter(e, game)
                        }
                        onMouseLeave={() => setHoveredGame(null)}
                        className="flex flex-1"
                      >
                        <img
                          src={game.background_image}
                          className="w-24 sm:w-32 h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="p-3 flex-1 flex flex-col justify-center">
                          <p className="text-sm sm:text-md font-semibold line-clamp-1">
                            {game.name}
                          </p>
                          <div className="mt-1 text-yellow-400 font-bold flex items-center text-sm">
                            <StarRateIcon fontSize="small" />
                            {(game.metacritic / 10).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* RIGHT BUTTON */}
        <button
          className="hidden md:block p-3 ml-2 rounded-full bg-black/40 border border-white/10 hover:bg-blue-600 transition-colors z-20"
          onClick={nextSlide}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      {/* TOOLTIP PORTAL - Ensure this only renders if not on mobile */}
      <AnimatePresence>
        {!isMobile && hoveredGame && coords && (
          <GamePortal>
            <GameTooltip
              game={hoveredGame}
              tooltipSide={tooltipSide}
              coords={coords}
            />
          </GamePortal>
        )}
      </AnimatePresence>
      {/* paganation dots */}
      <div className="flex gap-3 mt-8">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`h-2.5 transition-all duration-300 rounded-full ${
              i === currentPage
                ? "w-10 bg-blue-500"
                : "w-2.5 bg-gray-600 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
