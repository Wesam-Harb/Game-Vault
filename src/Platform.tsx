import { useState, useMemo, useEffect, useRef } from "react";
import useGamesFromFamily from "./Hooks/useGamesFromFamily";
import GameGallery from "./components/GameGallery";
import { GameTooltip } from "./components/GameTooltip";
import { usePlatforms } from "./Hooks/usePlatforms";
import type { FamilyApi } from "./Types/Family";
import type { Game } from "./Types/Game";
import { useIsMobile } from "./Hooks/useIsMobile";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

//MUI icons
import StarRateIcon from "@mui/icons-material/StarRate";
import SearchIcon from "@mui/icons-material/Search";

//MUI components
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { platformsFamilies } from "./API/getGamesFromFamily";
import { Skeleton } from "@mui/material";

import { AnimatePresence } from "framer-motion";

//react router
import { useParams, Link, useSearchParams } from "react-router";

import { createPortal } from "react-dom";
function GamePortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}

export default function Platform() {
  const isMobile = useIsMobile();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || "",
  );

  const searchSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if there is a search query in the URL
    const hasSearch = searchParams.get("search");

    if (hasSearch && searchSectionRef.current) {
      // Smoothly scroll to the search section
      searchSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);

      const newParams = new URLSearchParams(searchParams);
      if (searchQuery) {
        newParams.set("search", searchQuery);
      } else {
        newParams.delete("search");
      }

      setSearchParams(newParams, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, searchParams, setSearchParams]);

  const { family } = useParams();

  const { platforms } = usePlatforms();

  //------------------filters
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [platformParams, setPlatformParams] = useSearchParams();
  const platformFilter = platformParams.get("platform") || "All";

  const platformId = useMemo(() => {
    if (platformFilter === "All") return undefined;

    // Look through your platforms results to find the object with the matching slug
    const platformObject = platforms?.results
      .flatMap((f) => f.platforms)
      .find((p) => p.slug === platformFilter);

    return platformObject?.id; // This returns the number (e.g., 187)
  }, [platformFilter, platforms]);

  //Pass the NUMBER (ID) to the hook
  const { data, loading } = useGamesFromFamily(
    family?.toLowerCase() as keyof typeof platformsFamilies,
    platformId?.toString(), // Use the ID here
  );

  const handleChangeSort = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleChangeGenre = (event: SelectChangeEvent) => {
    setGenre(event.target.value);
  };

  const handleChangeMood = (event: SelectChangeEvent) => {
    setMood(event.target.value);
  };

  const handlePlatform = (
    _event: React.MouseEvent<HTMLElement>,
    value: string,
  ) => {
    if (value === "All") {
      platformParams.delete("platform");
    } else {
      platformParams.set("platform", value);
    }
    setPlatformParams(platformParams);
  };

  //filter itams
  const filteredItems = useMemo(() => {
    if (!data) return [];

    //Start with everything flattened
    let filtered = data.flatMap((response) => response.results || []);

    //Apply Search Filter (if there is a query)
    const query = debouncedSearch.toLowerCase().trim().replaceAll(" ", "");
    if (query) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().replaceAll(" ", "").includes(query),
      );
    }

    //Apply Genre Filter
    if (genre)
      filtered = filtered.filter(
        (item) =>
          item.genres.some((g) => g.name === genre) ||
          item.tags.some((t) => t.name === genre),
      );

    //Apply Mood
    if (mood)
      filtered = filtered.filter(
        (item) =>
          item.genres.some((g) => g.name === mood) ||
          item.tags.some((t) => t.name === mood),
      );

    if (sortBy)
      return [...filtered].sort((a, b) => {
        if (sortBy === "rate") {
          return (b.metacritic || 0) - (a.metacritic || 0); // High to Low
        }
        if (sortBy === "release") {
          return (
            new Date(b.released).getTime() - new Date(a.released).getTime()
          ); // Newest first
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name); // A-Z
        }

        return 0; //final fallback
      });
    return filtered;
  }, [data, debouncedSearch, genre, mood, sortBy]);

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

  const exclusive = data?.flatMap((response) => response.results)[0];
  const trending = data
    ?.flatMap((response) => response.results || [])
    .filter(Boolean) // This removes any undefined/null entries
    .slice(1, 6);
  return (
    <>
      <Nav />
      <main>
        <section className="relative h-100 overflow-hidden flex items-center py-6 px-12 max-md:px-6 max-md:py-8">
          <div className="absolute inset-0 z-0">
            {loading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ bgcolor: "grey.900" }}
              />
            ) : (
              <img
                className="w-full h-full object-cover"
                src={exclusive?.background_image}
              />
            )}
            <div
              className={`absolute inset-0 bg-linear-to-r ${loading ? "opacity-1" : "opacity-0"} from-surface via-surface/40 to-transparent`}
            ></div>
            <div
              className={`absolute ${loading ? "opacity-1" : "opacity-0"} inset-0 bg-linear-to-t from-surface to-transparent`}
            ></div>
          </div>
          <div className="relative w-full h-full flex flex-col justify-between z-10 max-w-2xl">
            {loading ? (
              <>
                <Skeleton
                  variant="text"
                  width={200}
                  height={40}
                  sx={{ mb: 2, bgcolor: "slate.900" }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={80}
                  sx={{ mb: 4, bgcolor: "slate.900" }}
                />
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      sx={{ bgcolor: "slate.900" }}
                      key={i}
                      variant="rounded"
                      width={60}
                      height={24}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-blue-600 text-white text-[12px] font-black px-2 py-1 rounded-sm tracking-widest">
                    {family?.toUpperCase()} EXCLUSIVE
                  </span>
                  <div
                    className="flex items-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
 gap-1 text-tertiary-container"
                  >
                    <StarRateIcon
                      fontSize="small"
                      className="material-symbols-outlined text-sm"
                    />
                    <span className="text-sm font-bold">
                      {exclusive?.metacritic
                        ? exclusive.metacritic / 10
                        : exclusive?.metacritic}
                    </span>
                  </div>
                </div>
                <h1
                  className="text-7xl max-md:text-3xl text-shadow-2xs drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
 font-black tracking-tighter mb-4 text-on-surface leading-[0.9]"
                >
                  {exclusive?.name}
                </h1>
                <div>
                  <div className=" mb-6 flex flex-wrap gap-1">
                    {exclusive?.platforms.map((platform) => (
                      <span
                        key={platform.platform.id}
                        className="text-xs max-md:text-[10px] px-3 py-1 rounded-md bg-surface-container-highest hover:bg-surface-bright text-on-surface-variant hover:text-on-surface"
                      >
                        {platform.platform.name}
                      </span>
                    ))}
                  </div>
                  {exclusive?.id ? (
                    <div className="flex gap-4">
                      <Link to={`/gameDetail/${exclusive?.id}`}>
                        <button className="px-8 py-4 max-md:px-4 max-md:py-2 cursor-pointer bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform">
                          View Details
                        </button>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
          <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-1/2 hidden xl:block pointer-events-none opacity-80">
            <img
              className="w-full -rotate-12"
              data-alt="PlayStation 5 console sleek vertical design"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjpHwvbMHK3X6oWo9Ezfe5WcxUtksRTQD37wKwqy8AGuuRH7xbdkugD_TMhWkGbpN8mIKv2fAMrZCrMuyX3a0JFdNBWTMcM3WXqkA50VHyn-X2Z_l8BkUyKUhkPxPqankI-tsmoI8EzsnxJhIjVSlLRE-d9mDOtT1YnkMbFz3HHHJzbZJwlC7njWyTE14Pw-e_ukn-wEPvSjrcsiFrQys0wg2wE4hSAQzku4yfHFZDBu9ldGZ0set2AJGT0Dshzli67UN_am7UUQ"
            />
          </div>
        </section>
        <section className="px-12 py-16 max-md:px-6 max-md:py-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-on-surface">
                Trending on {family}
              </h2>
              <p className="text-on-surface-variant">
                The most played titles this week
              </p>
            </div>
          </div>
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4">
            {/* slider cards */}
            {loading
              ? [1, 2, 3, 4].map((n) => (
                  <div key={n} className="shrink-0 w-112.5">
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height={250}
                      sx={{ borderRadius: "1rem", mb: 2 }}
                    />
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </div>
                ))
              : trending?.map((game) => (
                  <div
                    key={game.id}
                    className="shrink-0 w-112.5 max-sm:w-64 group cursor-pointer relative"
                    onMouseEnter={(e) =>
                      isMobile ? undefined : handleMouseEnter(e, game)
                    }
                    onMouseLeave={() => setHoveredGame(null)}
                  >
                    <div className="relative h-62.5 rounded-2xl overflow-hidden mb-4">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        data-alt="game image"
                        src={game.background_image}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-surface-container-low/90 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <span className="bg-tertiary-container text-tertiary text-[10px] font-bold px-2 py-1 rounded">
                          MUST PLAY
                        </span>
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-primary">
                          <StarRateIcon
                            fontSize="small"
                            className="material-symbols-outlined text-xs"
                          />
                          <span className="text-xs font-bold">
                            {game.metacritic / 20}
                          </span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {game.tags
                        .filter((tag) => {
                          return tag.language == "eng";
                        })
                        .slice(0, 3)
                        .map((tag) => (
                          <p
                            key={tag.id}
                            className="text-xs w-fit px-3 py-1 rounded-md bg-surface-container-highest  text-on-surface-variant"
                          >
                            {tag.language == "eng" ? tag.name : null}
                          </p>
                        ))}
                    </div>
                  </div>
                ))}
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
        </section>
        <section
          ref={searchSectionRef}
          className="px-12 py-8 max-md:px-6 max-md:py-8 scroll-mt-16 bg-surface-container-low border-y border-outline/10"
        >
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="relative flex-1 w-full">
                <SearchIcon className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  className="w-full bg-surface-container-highest border border-outline/20 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
                  placeholder="Find your next adventure..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-wrap gap-4 w-full lg:w-auto">
                <div className="flex-1">
                  <FormControl
                    sx={{
                      borderRadius: "12px",
                      minWidth: 120,
                      width: "100%",
                      background: "var(--color-surface-container-highest)",

                      "& .MuiSvgIcon-root": {
                        color: "var(--color-on-surface)",
                        border: "none",
                      },

                      "& .MuiOutlinedInput-input": {
                        border: "none",
                        color: "var(--color-on-surface) !important",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    <InputLabel
                      id="demo-simple-select-helper-label"
                      sx={{
                        color: "var(--color-on-surface)",
                      }}
                    >
                      Genre
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={genre}
                      label="Age"
                      onChange={handleChangeGenre}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Action">Action</MenuItem>
                      <MenuItem value="RPG">RPG</MenuItem>
                      <MenuItem value="Shooter">Shooter</MenuItem>
                      <MenuItem value="Horror">Horror</MenuItem>
                      <MenuItem value="Survival">Survival</MenuItem>
                      <MenuItem value="Strategy">Strategy</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <FormControl
                    sx={{
                      borderRadius: "12px",
                      width: "100%",
                      minWidth: 120,
                      background: "var(--color-surface-container-highest)",

                      "& .MuiSvgIcon-root": {
                        color: "var(--color-on-surface)",
                        border: "none",
                      },

                      "& .MuiOutlinedInput-input": {
                        border: "none",
                        color: "var(--color-on-surface) !important",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    <InputLabel
                      id="demo-simple-select-helper-label"
                      sx={{
                        color: "var(--color-on-surface)",
                      }}
                    >
                      Mood
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={mood}
                      label="Age"
                      onChange={handleChangeMood}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>

                      <MenuItem value="Singleplayer">Singleplayer</MenuItem>
                      <MenuItem value="Multiplayer">Multiplayer</MenuItem>
                      <MenuItem value="cooperative">cooperative</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="flex-1">
                  <FormControl
                    sx={{
                      borderRadius: "12px",
                      minWidth: 120,
                      width: "100%",
                      background: "var(--color-surface-container-highest)",

                      "& .MuiSvgIcon-root": {
                        color: "var(--color-on-surface)",
                        border: "none",
                      },

                      "& .MuiOutlinedInput-input": {
                        border: "none",
                        color: "var(--color-on-surface) !important",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    <InputLabel
                      id="demo-simple-select-helper-label"
                      sx={{
                        color: "var(--color-on-surface)",
                      }}
                    >
                      Sort By
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={sortBy}
                      label="Age"
                      onChange={handleChangeSort}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="release">release</MenuItem>
                      <MenuItem value="rate">rate</MenuItem>
                      <MenuItem value="name">name</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            {/* filter generations  */}
            {family?.toLocaleLowerCase() === "pc" ||
            family == undefined ? null : (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-xs font-black tracking-widest text-on-surface-variant uppercase mr-2">
                  Generations
                </span>
                <ToggleButtonGroup
                  value={platformFilter}
                  exclusive
                  onChange={handlePlatform}
                  aria-label="buttonGroup"
                  sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                >
                  <ToggleButton
                    sx={{
                      background: "var(--color-surface-container-highest)  ",
                      color: "color: var(--color-on-surface)",
                      fontSize: "10px",
                      paddingY: "8px",
                      paddingX: "12px",
                      height: "fit-content",
                      "&.MuiButtonBase-root": {
                        borderRadius: "15px",
                      },
                      "&.Mui-selected": {
                        color: "white",
                      },
                    }}
                    value="All"
                    aria-label="All"
                    defaultChecked
                  >
                    All
                  </ToggleButton>
                  {platforms?.results
                    .filter(
                      (e) =>
                        e.name.toLocaleLowerCase() ===
                        family?.toLocaleLowerCase(),
                    )
                    .flatMap((e) => e.platforms)
                    .map((e) => (
                      <ToggleButton
                        sx={{
                          background:
                            "var(--color-surface-container-highest)  ",
                          color: "color: var(--color-on-surface)",
                          fontSize: "10px",
                          paddingY: "8px",
                          paddingX: "12px",
                          height: "fit-content",
                          "&.MuiButtonBase-root": {
                            borderRadius: "15px",
                          },
                          "&.Mui-selected": {
                            color: "white",
                          },
                        }}
                        value={e.slug}
                        aria-label={e.slug}
                      >
                        {e.name}
                      </ToggleButton>
                    ))}
                </ToggleButtonGroup>
              </div>
            )}
            {/*  */}
          </div>
        </section>
        <section
          key={`hero-${family}-${platformFilter}`}
          className="px-12 py-16 max-md:px-6 max-md:py-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black tracking-tighter max-md:text-2xl">
                All {family?.toUpperCase()} Games
              </h2>
              <div className="flex gap-4">
                <span className="text-on-surface-variant font-medium">
                  Showing{" "}
                  <span className="text-primary">{filteredItems.length}</span>{" "}
                  games
                </span>
              </div>
            </div>
            <div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="space-y-2">
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        sx={{ borderRadius: "12px" }}
                      />
                      <Skeleton variant="text" />
                      <Skeleton variant="text" width="60%" />
                    </div>
                  ))}
                </div>
              ) : (
                <GameGallery
                  data={filteredItems}
                  search={searchQuery}
                  key={searchQuery}
                />
              )}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
