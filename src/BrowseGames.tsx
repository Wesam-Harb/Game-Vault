import { usePlatforms } from "./Hooks/usePlatforms";
import { useMemo, useState } from "react";
import useGamesFromFamily from "./Hooks/useGamesFromFamily";
import { platformsFamilies } from "./API/getGamesFromFamily";

//react router
import { Link } from "react-router";

export default function BrowserGames(search?: string) {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("All");

  const { data } = useGamesFromFamily(
    platformFilter?.toLocaleLowerCase() as keyof typeof platformsFamilies,
  );
  const games = data?.flatMap((e) => e.results);
  const { platforms } = usePlatforms();

  //------------------filters
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [sortBy, setSortBy] = useState("");

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
    setPlatformFilter(value);
  };

  const filteredItems = useMemo(() => {
    if (!data) return [];

    //Start with everything flattened
    let filtered = data.flatMap((response) => response.results);

    //Apply Platform Filter (if not "All")
    if (platformFilter !== "All") {
      filtered = filtered.filter((item) =>
        item.platforms.some((p) => p.platform.slug === platformFilter),
      );
    }

    //Apply Search Filter (if there is a query)

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
        if (sortBy === "metacritic") {
          return (b.metacritic || 0) - (a.metacritic || 0); // High to Low
        }
        if (sortBy === "released") {
          return (
            new Date(b.released).getTime() - new Date(a.released).getTime()
          ); // Newest first
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name); // A-Z
        }

        //return the results after BOTH filters have run
      });
    return filtered;
  }, [data, platformFilter, genre, mood, sortBy]);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-10" data-purpose="search-interface">
          <div className="relative rounded-2xl overflow-hidden mb-8 h-64 flex items-center justify-center">
            <img
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2VLFgfwXub-bE1LbLPH19udoLN107rxJqfqnRkpcLb5b8n9Rr6L4SsIixktmvTzbCTmCILU2p5Vx7teQhktAmOKUO3qWgFcAWJnm9rTK4S0a0R6XOkNOaZs0nZzcWaDHAEgKRgPpzAsleRTMBUPfgSptEn_L-y87B-nO4IUc5HM7INhz134cGFxzCBhgm_CQthyJQ8_9YzRskKlDTs7fsw9Bnh-Hi2PUNiZyNPQTVmQqQ1cxPyOyPDCu1I85x0Xojn2GB9qw_cA"
            />
            <div className="absolute inset-0 bg-linear-to-t from-game-dark to-transparent"></div>
            <div className="relative z-10 w-full max-w-2xl px-6 text-center">
              <h1 className="text-4xl font-bold mb-4">
                Discover Your Next Favorite Game
              </h1>
              <p className="text-gray-300 mb-6">
                Search and explore thousands of titles across all platforms.
              </p>
              <div className="flex gap-2">
                <input
                  className="grow bg-[#1f2937]/80 border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Search for games..."
                  type="text"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 p-4 glass-card rounded-xl">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase font-bold mb-1 ml-1">
                Genre
              </label>
              <select className="bg-[#2d3748] py-1 px-2 border-none rounded-lg text-sm text-gray-200 focus:ring-blue-500 pr-10">
                <option>Action</option>
                <option>RPG</option>
                <option>Adventure</option>
                <option>Sports</option>
                <option>Strategy</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase font-bold mb-1 ml-1">
                Platform
              </label>
              <select className="bg-[#2d3748] py-1 px-2 border-none rounded-lg text-sm text-gray-200 focus:ring-blue-500 pr-10">
                <option>All Platforms</option>
                <option>PC</option>
                <option>PS5</option>
                <option>Xbox Series X</option>
                <option>Nintendo Switch</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 uppercase font-bold mb-1 ml-1">
                Sort By
              </label>
              <select className="bg-[#2d3748] py-1 px-2 border-none rounded-lg text-sm text-gray-200 focus:ring-blue-500 pr-10">
                <option>Rating (High to Low)</option>
                <option>Release Date (Newest)</option>
                <option>Most Popular</option>
              </select>
            </div>
            <div className="ml-auto self-end pb-1">
              <span className="text-gray-400 text-sm italic">
                Showing 3 results for{" "}
                <span className="text-blue-400 font-medium">
                  "Action Games"
                </span>
              </span>
            </div>
          </div>
        </section>
        <section className="space-y-4" data-purpose="results-listing">
          {games?.map((item) => (
            <article
              key={item.id}
              className="bg-[#1f2937b3] rounded-xl overflow-hidden flex flex-col sm:flex-row items-center transition-transform hover:scale-[1.01]"
            >
              <div className="w-full sm:w-48 h-32 shrink-0">
                <img
                  alt="Doom Eternal Cover"
                  className="w-full h-full object-cover"
                  src={item.background_image}
                />
              </div>
              <div className="p-6 grow flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <span className="mr-1">★</span>
                      <span className="font-bold">
                        {item.metacritic ? item.metacritic / 10 : item.rating}
                      </span>
                    </div>
                  </div>
                  {item.genres.map((item) => (
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                      {item.name}
                    </p>
                  ))}
                  <div className="flex space-x-1">
                    <span className="text-xs text-yellow-500">★★★★★</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                    title="Add to Favorites"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      ></path>
                    </svg>
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
          {/* <article className="glass-card rounded-xl overflow-hidden flex flex-col sm:flex-row items-center transition-transform hover:scale-[1.01]">
            <div className="w-full sm:w-48 h-32 shrink-0">
              <img
                alt="Devil May Cry 5 Cover"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBreLy5-lfhStUxtDbSrYallZ4paxuyb71Z8jwgkcWuTasWxSbSout3xly-6M1Tqx6kMeA_uGjZ_yHZ4-IHoPSIXGY00hFOuk63VWu2cLPcrUQMXYP3j9GQo1mFGh0uwrLyemO7S6SfHw5-Y8fMf99bXAzaAvSvYZyRfNvOdNTgkOrCn3WnVE4_hnQ9XifzT0iqwX9Y9CSpZuG8JdH_trPh3WfLAR6TZKVNCkwMIewiOJ5yHzRsAQlEh9zNA-90AFiiTCKhml6vjQ"
              />
            </div>
            <div className="p-6 grow flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-xl font-bold">Devil May Cry 5</h3>
                  <div className="flex items-center text-yellow-500 text-sm">
                    <span className="mr-1">★</span>
                    <span className="font-bold">9.0</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                  Capcom | 2019
                </p>
                <div className="flex space-x-1">
                  <span className="text-xs text-yellow-500">★★★★☆</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    ></path>
                  </svg>
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </article>
          <article className="glass-card rounded-xl overflow-hidden flex flex-col sm:flex-row items-center transition-transform hover:scale-[1.01]">
            <div className="w-full sm:w-48 h-32 shrink-0">
              <img
                alt="Ghost of Tsushima Cover"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxYIEe8cEwBDcp0BHhiKx-sh-RB3z9wI-WHD-FCGtt5VtCuauDJK-b7Pnrvr2S7zawP2l8qzlMzIgCAAImDNnupQbJ4HrjjQScNLE9ZA4OpJvv8fD-cuQguaKQ9L7j6vVWC4-SkWxHOL_A_k0nmmLfhp9cRspzI5Nhud_0qKE0B92qPKOySHwBXk91-CwTyJRXubVAuHfblYM1XPT4vxpjycku_jxW8W_m8cZEnEXTbRGwbYjoeidN1kGno5n99sbUtwoHxgfwhA"
              />
            </div>
            <div className="p-6 grow flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-xl font-bold">Ghost of Tsushima</h3>
                  <div className="flex items-center text-yellow-500 text-sm">
                    <span className="mr-1">★</span>
                    <span className="font-bold">9.8</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                  Sucker Punch | 2020
                </p>
                <div className="flex space-x-1">
                  <span className="text-xs text-yellow-500">★★★★★</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    ></path>
                  </svg>
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </article> */}
        </section>
        <section className="mt-16" data-purpose="recommendations">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <p className="text-gray-400 text-sm">Based on your interests</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </button>
              <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-3">
                <img
                  alt="Hades"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9swHdUDW0GX4EXwNIXZYLSfZ-EHPPf9P9wc4ilBTEm9kWrHMrZZZ3atyBvA1Tj7bmedbQnRv1Jl90XLOEfD1Mrsu2fUVDEWwUPaewFWKUJlHCFmew2vERWtvj1Z1OlLT1wEoozmmCv7tX7gE7gnUixbXkGvycjqlq-2qY2oAtIvuuPZCfnhC9F3gXuuueSj3R3PTOK-Ymp8Ld0plSUN5eN_iCTsRhY2I742Bj01loaPn13-U8gs0pEkR5Ow3JRDMK7KsoaGhYdQ"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase">
                    Quick Look
                  </span>
                </div>
              </div>
              <h4 className="font-bold">Hades</h4>
              <p className="text-sm text-gray-400">You May Like</p>
            </div>
            <div className="group cursor-pointer">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-3">
                <img
                  alt="Horizon Zero Dawn"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPY_FEFQXUjXYXUXZUc4FQfFadlXJQYjp1yJUMxnpyPk_hxiP-H8ZRmyni1yAqDV_yhMEZuB6TIP4NRGGxuziu77BisL4FGV3EmeBjqnX-0ztzYCxMq_o00jqAGqSPwCEXfnW1KVdo5KAk-sq598wQ-r12F2XQLWYTc5YnCEU-v2b3CBH7M1kemxICerf0aQP4u0KJF4ImXkO9RlunAP_QMUu7N1xk5ycEijuYELHn84nTdZdWso32QsnlunDDMYDZM-q2eNEpLA"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase">
                    Quick Look
                  </span>
                </div>
              </div>
              <h4 className="font-bold">Horizon Zero Dawn</h4>
              <p className="text-sm text-gray-400">You May Like</p>
            </div>
            <div className="group cursor-pointer">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-3">
                <img
                  alt="Mass Effect"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEMGLr9Fp2PgQtU9AaAB5I8w0NwdWy0-GbFVV3ztMmiz3ZSoMYLdAdDpW-H_eFzlS6oj_YEw9TnvQA1M3K5W7JKWvqPOyRiTBuyU9TOjBdPVjNPzdCb6hItGW5vL8j4OyidFhvtfaoEm2wz7MhHpr9zh3Y6DcgZ_u5Jb4usV5zGLUZTkXkZmPntmCMm-quDdDtukwzhB4rf9jFypHBLRF8sUxsRG43vx1kNUnUm1U5S08iUB9wYu582SfN3jhLMSoxnGQtOKs1sQ"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase">
                    Quick Look
                  </span>
                </div>
              </div>
              <h4 className="font-bold">Mass Effect Legendary Edition</h4>
              <p className="text-sm text-gray-400">You May Like</p>
            </div>
            <div className="group cursor-pointer">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden mb-3">
                <img
                  alt="Assassin's Creed Valhalla"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7rOm-lN_Y7DmnNNBB9QELdK91yiuBMuw9orM42GV3gT5lmT2cpi0G3QHvTfQRgmoMdrcM-E-oEG_WzbG3PYK2tKmdFRGkZFBCPTv9kMIYdH-IUFxDEeS7tGPzJJDiAHOpsL61Cprd7ORBp2pC8tFUTHtUsAXUdnDkXmKw3jcPrZdtxdnc12Gglzv6nD6VBP0jmsNCkuIRFo-PVEV9w67wt7vN9Vo4DwBVorpq1HQMoNipWo4Vq12ncMrZoDt4iCMzZhphh3H5zQ"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase">
                    Quick Look
                  </span>
                </div>
              </div>
              <h4 className="font-bold">Assassin's Creed Valhalla</h4>
              <p className="text-sm text-gray-400">You May Like</p>
            </div>
          </div>
        </section>
      </main>
      <footer
        className="bg-[#161b22] border-t border-gray-800 mt-20 pt-12 pb-8"
        data-purpose="site-footer"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-8">
            <nav className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm font-medium">
              <a
                className="flex items-center space-x-2 hover:text-white transition-colors"
                href="#"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
                <span>Home</span>
              </a>
              <a
                className="flex items-center space-x-2 hover:text-white transition-colors"
                href="#"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
                <span>Browse Games</span>
              </a>
              <a
                className="flex items-center space-x-2 hover:text-white transition-colors"
                href="#"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
                <span>Favorites</span>
              </a>
              <a
                className="flex items-center space-x-2 hover:text-white transition-colors"
                href="#"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
                <span>News</span>
              </a>
            </nav>
            <div className="flex space-x-6">
              <a className="text-gray-400 hover:text-white" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                </svg>
              </a>
              <a className="text-gray-400 hover:text-white" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a className="text-gray-400 hover:text-white" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-xs border-t border-gray-800 pt-8">
            © 2023 Game Explorer. All rights reserved. Data provided by GameDB
            API.
          </div>
        </div>
      </footer>
    </>
  );
}
