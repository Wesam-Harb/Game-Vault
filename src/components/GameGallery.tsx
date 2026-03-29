import { useState, useMemo, memo } from "react";
import type { FamilyApi } from "../Types/Family";
import type { Game } from "../Types/Game";
import { GameTooltip } from "./GameTooltip";
import { useIsMobile } from "../Hooks/useIsMobile";

//MUI component
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

//MUI icons
import StarRateIcon from "@mui/icons-material/StarRate";

import { Link } from "react-router";

import { AnimatePresence } from "framer-motion";

import { createPortal } from "react-dom";
function GamePortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}

export default function GameGallery({
  data,
}: {
  data: FamilyApi[] | null;
  search: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  //when newsData are mounted , assign the items to allItems
  const allItems = useMemo(() => {
    if (!data) return [];
    else return data;
  }, [data]);

  const totalCount = Math.ceil(allItems.length / itemsPerPage); //get the pages number

  //get 9 items for every page
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return allItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [allItems, currentPage]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Smooth scroll to top when page changes to reduce "heavy" feeling
    window.scrollTo({ top: 1000, behavior: "smooth" });
  };

  const paginationComponent = useMemo(
    () => (
      <Stack spacing={6} sx={{ mt: 8 }}>
        <Pagination
          page={currentPage}
          onChange={handleChange}
          count={totalCount}
          color="primary"
          shape="rounded"
          sx={{
            mx: "auto",
            "& .MuiPagination-ul": {
              width: "fit-content",
              mx: "auto",
              rowGap: "10px",
            },
            "& .MuiPagination-ul li button": {
              color: "white !important",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: "40px",
              height: "40px",
              background: "rgba(30, 41, 59, 0.7)",
            },
            "& .MuiPagination-ul li .Mui-selected": {
              backgroundColor: "rgba(59, 130, 246, 0.5) !important", // Tailored selection color
            },
            "& .MuiPagination-ul li div": {
              color: "white",
            },
          }}
        />
      </Stack>
    ),
    [currentPage, totalCount],
  );

  if (data?.length === 0) {
    return (
      <div className="text-white p-10">
        No games found matching your search.
      </div>
    );
  }
  return (
    <div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentItems.map((item: FamilyApi) => (
          <Link to={`/gameDetail/${item.id}`}>
            <GameCard key={item?.id} item={item} />
          </Link>
        ))}
      </div>

      {paginationComponent}
    </div>
  );
}

const GameCard = memo(({ item }: { item: FamilyApi }) => {
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

  const isMobile = useIsMobile();

  return (
    <div
      className="bg-surface-container-highest rounded-2xl relative  group border border-outline/5 hover:border-primary/20 transition-colors"
      onMouseEnter={(e) => (isMobile ? undefined : handleMouseEnter(e, item))}
      onMouseLeave={() => setHoveredGame(null)}
    >
      <div className="aspect-video overflow-hidden relative">
        <img
          className="w-full h-full rounded-t-2xl object-cover group-hover:scale-105 transition-transform duration-500"
          data-alt="Retro gaming console aesthetic"
          src={item?.background_image}
        />
        <div className="flex items-center gap-1 absolute right-4 bottom-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-primary">
          <StarRateIcon
            fontSize="small"
            className="material-symbols-outlined text-xs"
          />
          <span className="text-xs font-bold">{item?.metacritic / 20}</span>
        </div>
      </div>
      <div className="p-4 min-h-36">
        <div className="flex justify-between items-start mb-2">
          <h5 className="font-bold text-md text-white group-hover:text-primary transition-colors">
            {item?.name}
          </h5>
        </div>
        <div className="flex gap-2 flex-wrap  ">
          {item?.tags
            .filter((tag) => {
              return tag.language === "eng";
            })
            .slice(0, 4)
            .map((tag) => (
              <span
                key={tag?.id}
                className="text-[10px] uppercase font-bold text-on-surface-variant border border-outline/20 px-1 py-0.5 rounded"
              >
                {tag.name}
              </span>
            ))}
        </div>
      </div>
      <AnimatePresence>
        {hoveredGame && coords && (
          <GamePortal>
            <GameTooltip
              game={hoveredGame}
              tooltipSide={tooltipSide}
              coords={coords}
            />
          </GamePortal>
        )}
      </AnimatePresence>
    </div>
  );
});
