import { useState } from "react";
import useGamesDetails from "./Hooks/useGamesDetail";
import { useParams } from "react-router";
import { useSimilarGames } from "./Hooks/useSimilarGames";
import { GameTooltip } from "./components/GameTooltip";
import type { FamilyApi } from "./Types/Family";
import type { Game } from "./Types/Game";
import { useFavorites } from "./Hooks/useFavorites";
import Footer from "./components/Footer";

import { AnimatePresence } from "framer-motion";

//MUI component
import { Skeleton } from "@mui/material";

//react router
import { Link } from "react-router";
import { createPortal } from "react-dom";

function GamePortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}

export function GameDetail() {
  const { id } = useParams();

  const { data, screens, trailer, loading } = useGamesDetails(id);

  const gameTrailer = trailer?.videos
    .flatMap((item) => item)
    .filter((t) => t.includes("https://video.akamai."))[0];

  const { similar, loadingSimilar } = useSimilarGames(data);

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

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorited = data ? isFavorite(data.id) : false;

  const handleToggleFavorite = () => {
    if (!data) return; // Guard against null data

    if (favorited) {
      removeFavorite(data.id);
    } else {
      addFavorite(data);
    }
  };
  return (
    <>
      <header
        className="sticky top-0 z-50 bg-game-dark/80 backdrop-blur-md border-b border-gray-800"
        data-purpose="navigation-bar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-8 ">
            <Link
              className="text-2xl font-bold tracking-tighter text-game-accent"
              to={"/"}
            >
              GAME<span className="text-white">VAULT</span>
            </Link>
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
              <Link
                to={"/browse"}
                className="hover:text-white transition-colors"
              >
                Browse Games
              </Link>
              <Link
                to={"/favorite"}
                className="hover:text-white transition-colors"
              >
                Favorites
              </Link>
              <Link to={"/news"} className="hover:text-white transition-colors">
                News
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
              <img
                alt="User Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi4PNdH_ZO8CdcXPf-VaF5NT3zUzz9BSSHJxjPaG75Lx3QxRahqlMujYUMt-xqt-zM71PFpPyq0FhiicoYPbSTvv4wIYqDZRZoFd2Z8DHZshCqvoiu7zJtDD8qRVzhRmd6CVS_dhizuTuu4TxBUgX0LFiRiA7JlsGYJjnrVTmVuKsUMLQmUgzHfHEP4AFoA2aPTnQW7G4pVVz5tVP23GQzInKCqX8J51H69ODDF-eEHEAQJBiM_9jDKdV3igMqYUaE99BCjdc-Tg"
              />
            </div>
          </div>
        </div>
      </header>
      <main>
        <section
          className="relative w-full h-[60vh] md:h-[90vh] overflow-hidden"
          data-purpose="game-hero"
        >
          <img
            alt="Elden Ring Hero"
            className="w-full h-full object-cover"
            src={data?.background_image}
          />
          <div className="absolute inset-0 hero-gradient"></div>
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div data-purpose="game-identity">
                <h1 className="text-4xl md:text-6xl text-white font-black mb-4 uppercase tracking-tight">
                  {data?.name}
                </h1>
                <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
                  {data?.stores.length ? (
                    <div
                      className="flex gap-2 items-center
                    "
                    >
                      <span>Available On</span>
                      {data?.stores.map((store) => (
                        <span
                          key={store.id}
                          className="px-2 py-1 min-h-10 flex items-center bg-gray-800 rounded text-[10px]"
                        >
                          {store.store.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <span className="flex items-center gap-1 text-yellow-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    {data?.metacritic ? data?.metacritic / 10 : data?.rating}
                  </span>
                </div>
              </div>
              <div
                className="flex flex-col gap-3"
                data-purpose="purchase-actions"
              >
                <div className="flex gap-3">
                  <button className="bg-game-accent hover:bg-game-accent-hover text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20">
                    Buy Now
                  </button>
                  <button
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      favorited
                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-500"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                    title={
                      favorited ? "Remove from Favorites" : "Add to Favorites"
                    }
                    onClick={handleToggleFavorite}
                  >
                    <svg
                      className="w-6 h-6 transition-transform active:scale-90"
                      // Change fill based on status
                      fill={favorited ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {loading ? (
                <section>
                  <h2 className="text-xl font-bold mb-6 border-l-4 border-game-accent pl-4">
                    Trailer
                  </h2>
                  {/* Wrap in an aspect-video container to give it shape */}
                  <div className="aspect-video w-full">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%" // Now 100% of aspect-video
                      sx={{ bgcolor: "grey.900", borderRadius: "1.5rem" }}
                    />
                  </div>
                </section>
              ) : gameTrailer ? (
                <section>
                  <h2 className="text-xl font-bold mb-6 border-l-4 border-game-accent pl-4">
                    Trailer
                  </h2>
                  <div className="relative w-full aspect-video rounded-3xl overflow-hidden ...">
                    <video
                      key={gameTrailer}
                      controls
                      autoPlay={false}
                      className="w-full h-full object-cover"
                      playsInline
                    >
                      <source src={gameTrailer} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </section>
              ) : null}
              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(() => (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100px"
                      sx={{ bgcolor: "grey.900" }}
                    />
                  ))}
                </div>
              ) : screens?.results.length ? (
                <section data-purpose="screenshots-gallery">
                  <h2 className="text-xl font-bold mb-6 border-l-4 border-game-accent pl-4">
                    Screenshots
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {screens?.results.map((screen) => (
                      <div
                        key={screen?.id}
                        className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
                      >
                        <img
                          alt="Game Scene 1"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          src={screen?.image}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
              {loading ? (
                <div className="space-y-2">
                  <Skeleton
                    variant="text"
                    width="100%"
                    sx={{ bgcolor: "grey.900" }}
                  />
                  <Skeleton
                    variant="text"
                    width="100%"
                    sx={{ bgcolor: "grey.900" }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    sx={{ bgcolor: "grey.900" }}
                  />
                </div>
              ) : data?.description_raw ? (
                <section data-purpose="game-description">
                  <h2 className="text-xl font-bold mb-6 border-l-4 border-game-accent pl-4">
                    Description
                  </h2>
                  <div className="text-gray-400 space-y-4 leading-relaxed">
                    <p>{data?.description_raw}</p>
                  </div>
                </section>
              ) : null}
            </div>
            <aside className="space-y-8" data-purpose="game-metadata">
              <div className="bg-game-card p-6 rounded-2xl border border-gray-800 shadow-xl">
                <h3 className="text-lg font-bold mb-6 text-white">Game Info</h3>
                <div className="space-y-4">
                  {data?.developers.length ? (
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-gray-500 text-sm">Developer</span>
                      <span className="text-gray-200 font-medium text-sm">
                        {data?.developers[0].name}
                      </span>
                    </div>
                  ) : null}
                  {data?.publishers.length ? (
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-gray-500 text-sm">Publisher</span>
                      <span className="text-gray-200 font-medium">
                        <span className="text-gray-200 font-medium text-sm">
                          {data?.publishers[0].name}
                        </span>
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-500 text-sm">Release Date</span>
                    <span className="text-gray-200 font-medium">
                      {data?.released}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-gray-500 text-sm block mb-2">
                      Platforms
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {data?.platforms.map((platform) => (
                        <span
                          key={platform.platform.id}
                          className="bg-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {platform.platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {data?.genres.slice(0, 2).map((tag) => (
                  <div
                    key={tag.id}
                    className="bg-game-card p-4 rounded-xl border border-gray-800 text-center"
                  >
                    <span className="text-sm text-gray-400">{tag.name}</span>
                  </div>
                ))}
                {data?.tags.slice(0, 8).map((tag) => (
                  <div
                    key={tag.id}
                    className="bg-game-card p-4 rounded-xl border border-gray-800 text-center"
                  >
                    <span className="text-sm text-gray-400">{tag.name}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
          <section className="mt-20" data-purpose="related-content">
            <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar">
              {loadingSimilar
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
                : similar.map((game) => (
                    <Link to={`/gameDetail/${game.id}`} key={game.id}>
                      <div
                        className="min-w-70 relative bg-game-card rounded-xl border border-gray-800 group cursor-pointer"
                        onMouseEnter={(e) => handleMouseEnter(e, game)}
                        onMouseLeave={() => {
                          setHoveredGame(null);
                          setCoords(null);
                        }}
                      >
                        <div className="h-40 overflow-hidden rounded-t-xl">
                          <img
                            alt="game background"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            src={game?.background_image}
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-100 truncate pr-2">
                              {game?.name}
                            </h4>
                            <span className="text-yellow-500 text-sm flex items-center">
                              ★ {game?.metacritic ? game?.metacritic / 10 : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
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
        </div>
      </main>
      <Footer />
    </>
  );
}
