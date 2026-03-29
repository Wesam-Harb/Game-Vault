import { useState, useEffect } from "react";
import { useLatestGames } from "./Hooks/useGamesLastReleased";
import { useNews } from "./Hooks/useLatestNews";
import { Slider } from "./components/Slider";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

import { Link } from "react-router";

//MUI components
import { Skeleton } from "@mui/material";

import PS5 from "./assets/images_LE_upscale_prime.jpg";
import PC from "./assets/images (1)_LE_upscale_prime.jpg";

export function Home() {
  const [current, setCurrent] = useState(0);

  const { data, loading } = useLatestGames();
  const { newsData, newsLoading } = useNews(undefined);
  const firstNews = newsData?.slice(0, 1)[0].items.slice(0, 1)[0];
  const restNews = newsData?.slice(0, 1)[0].items.slice(1, 4);

  const nextSlide = () => {
    if (data?.results) {
      setCurrent((prev) => (prev + 1) % data.results.length);
    }
  };

  const prevSlide = () => {
    if (data?.results) {
      setCurrent((prev) => (prev === 0 ? data.results.length - 1 : prev - 1));
    }
  };

  // Auto slide
  useEffect(() => {
    if (!data?.results?.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.results.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.results.length, data]); // Only re-runs if the total number of pages changes

  return (
    <>
      <Nav />

      <main>
        <section
          className="relative h-[80vh] max-sm:h-[40vh] max-sm:min-h-auto min-h-100 w-full overflow-hidden"
          data-purpose="hero-landing"
        >
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{ bgcolor: "grey.900" }}
              width="100%"
              height="100%"
            />
          ) : (
            data?.results.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="absolute inset-0">
                  {/* Image */}
                  <img
                    src={slide.background_image}
                    alt={slide.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 hero-gradient"></div>
                </div>
                {/* Overlay */}
                <div className="relative h-full container mx-auto px-4 flex flex-col justify-end max-sm:justify-between max-sm:py-4 pb-20">
                  <div className=" animate-fade-in-up">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-blue-600 text-white rounded">
                      Latest Release
                    </span>
                    <h1 className="text-5xl md:text-7xl max-sm:text-xl font-extrabold text-white mb-4 leading-tight">
                      {slide.name}
                    </h1>

                    <Link
                      to={`gameDetail/${slide.id}`}
                      className="px-8 py-3 max-sm:px-2 max-sm:py-1 max-sm:text-xs bg-white text-black font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
                    >
                      View Detials
                    </Link>
                  </div>
                  <div className="ml-auto flex gap-4 max-sm:mr-auto max-sm:ml-0">
                    <button
                      onClick={prevSlide}
                      aria-label="Previous"
                      className="p-3 max-sm:p-0 rounded-full bg-black/40 border border-white/10 hover:bg-blue-600 transition-colors"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 19l-7-7 7-7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></path>
                      </svg>
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Next"
                      className="p-3 max-sm:p-0 rounded-full bg-black/40 border border-white/10 hover:bg-blue-600 transition-colors"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="absolute z-10 bottom-8 right-4 flex items-center gap-4">
            <div className="flex gap-2 mr-4">
              {data?.results.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-6 rounded-full ${
                    i === current ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="py-16 bg-[#0a0a0c]"
          data-purpose="top-rated-section"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Top Rated Games
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  Critically acclaimed masterpieces of the decade
                </p>
              </div>
            </div>

            <Slider />
          </div>
        </section>

        <section
          className="py-16 bg-[#111115]"
          data-purpose="platform-browsing"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">
              Browse by Platform
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-6 custom-scrollbar scroll-smooth">
              <div className="shrink-0 w-64 h-32 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5">
                <Link to="/platform/pc">
                  <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-600/60 transition-colors z-10"></div>
                  <img
                    alt="PC"
                    className="w-full h-full object-cover"
                    src={PC}
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-black text-white italic">PC</h3>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                      Master Race
                    </p>
                  </div>
                </Link>
              </div>
              <div className="shrink-0 w-64 h-32 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5">
                <Link to="/platform/playstation">
                  <div className="absolute inset-0 bg-blue-800/40 group-hover:bg-blue-500/60 transition-colors z-10"></div>
                  <img
                    alt="PlayStation"
                    className="w-full h-full object-cover"
                    src={PS5}
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-black text-white italic">
                      PLAYSTATION
                    </h3>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                      Experience More
                    </p>
                  </div>
                </Link>
              </div>
              <div className="shrink-0 w-64 h-32 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5">
                <Link to="/platform/xbox">
                  <div className="absolute inset-0 bg-green-900/40 group-hover:bg-green-600/60 transition-colors z-10"></div>
                  <img
                    alt="Xbox"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1NYRELyPw9UNa8_jLp4w1RIEAP07nF4LInxiMypqqZpEyIt2fskbAJqssygl4WSHGJz9vqIPhMoAR6DaKosDgfSlH76JWQVEHNcb7V-Wadj89N1UoT332jTDwKSQpWa_rVrhZMrbUmDd4jKEd5K36rHdL56TOywXG-vW81mGkQ_RKtjtiez8UPhrlQAtvub-a9uxHGg884o7FpO66SZGQC8H7Xl0XbA6n8bLLdqePjNLZZKTqGoMiUN_tSFCtoEuYgof6tBp5rg"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-black text-white italic">
                      XBOX
                    </h3>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                      Power Your Dreams
                    </p>
                  </div>
                </Link>
              </div>
              <div className="shrink-0 w-64 h-32 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5">
                <Link to="/platform/nintendo">
                  <div className="absolute inset-0 bg-red-900/40 group-hover:bg-red-600/60 transition-colors z-10"></div>
                  <img
                    alt="Nintendo Switch"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2c7YhsCmjqpMbzybxxNsCQztZtH7aWPDSkeAHijzH9Blu_Ef9fDcxfXUge4X93RX4TGdZQ8SkLvcNXSjv7gMeJK3Hux2Hm7cCokHLfg3ZeH4IEe1OON007QpdN6Hny2XJZxkpFKetag1GCiwTPk0HL7EoYazapMhV28hMF4HqGxWOw5oNk7rrSfKQN_qYasmIg5ME71fTSa7HHlFSCOME91ytIjPTtcUrLWespNTkMNNQ2Yy6p2nEL8C1WgXrpGjjyRgA2eDvjQ"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-black text-white italic">
                      SWITCH
                    </h3>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                      Play Anywhere
                    </p>
                  </div>
                </Link>
              </div>
              <div className="shrink-0 w-64 h-32 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5">
                <Link to="/platform/mobile">
                  <div className="absolute inset-0 bg-purple-900/40 group-hover:bg-purple-600/60 transition-colors z-10"></div>
                  <img
                    alt="Mobile"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1zTD0yULDpL0NkzyxJVRkp7BesddQ4w0EwmfYcWm2xVLPXcEt8dZi8fePOenJsjAWXfvu-KpRw_aGk06FfYnivlgp6dAhTgmSDaDatpaX3lOnVtRyWHRGSwDZQ3X5t5HSqRr6It4_6XynaMnkf8-24G8fVl8BCyQPufj5HUPCN0Q_rrwGtQrBNQkoMJ_XdOb4b20uGopysyzTXEip0NQaWoPZf41YzVll0UOQBYe7w05XtW3N6DEdq5sFXLc24TpCUgvLeApUfQ"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <h3 className="text-xl font-black text-white italic">
                      MOBILE
                    </h3>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                      Pocket Gaming
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#0a0a0c]" data-purpose="news-grid">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Latest Gaming News
              </h2>
              <Link
                className="text-blue-500 text-sm font-semibold"
                to={"/news"}
              >
                All News
              </Link>
            </div>
            {/* Lates News Section*/}
            {newsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Big News Skeleton */}
                <div className="md:col-span-2">
                  <Skeleton
                    variant="rounded"
                    height={400}
                    sx={{ bgcolor: "grey.900", borderRadius: "1.5rem" }}
                  />
                </div>
                {/* Sidebar News Skeletons */}
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton
                        variant="rounded"
                        width={96}
                        height={96}
                        sx={{ bgcolor: "grey.900" }}
                      />
                      <div className="flex-1">
                        <Skeleton width="40%" sx={{ bgcolor: "grey.900" }} />
                        <Skeleton width="90%" sx={{ bgcolor: "grey.900" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <a
                  href={firstNews?.url}
                  className="block md:col-span-2 group cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-4">
                      <img
                        alt="News Headline"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={firstNews?.image}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/90 to-transparent">
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                          {firstNews?.title}
                        </span>
                        <h3 className="text-xl font-bold text-white leading-tight">
                          {firstNews?.content_text}
                        </h3>
                      </div>
                    </div>
                  </div>
                </a>
                <div className="space-y-6">
                  {restNews?.map((news) => (
                    <a key={news.id} href={news.url} className=" block">
                      <div className="flex gap-4 group cursor-pointer">
                        <img
                          alt="News thumbnail"
                          className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:opacity-80 transition-opacity"
                          src={news.image}
                        />
                        <div>
                          <span className="text-blue-400 text-[10px] font-bold uppercase">
                            {news.title}
                          </span>

                          <p className="text-xs text-gray-500 mt-1">
                            {news.date_published}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}

                  <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors mt-2">
                    More News Items
                  </button>
                </div>
              </div>
            )}
            {/* END */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
