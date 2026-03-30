import { useNews } from "./Hooks/useLatestNews";
import { NewsGallery } from "./components/NewsGallery";
import { useState, useMemo } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

//MUI component
import { Skeleton } from "@mui/material";

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { newsData, newsLoading } = useNews(
    selectedCategory as "hardware" | "esports" | "indie" | "all",
  );

  const categories = [
    { id: "all", label: "Latest News" },
    { id: "hardware", label: "Hardware" },
    { id: "esports", label: "E-Sports" },
    { id: "indie", label: "Indie Games" },
  ];

  const filteredItems = useMemo(() => {
    if (!newsData) return [];

    //Filter based on the search state
    if (!searchQuery.trim()) return newsData;

    return newsData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [newsData, searchQuery]);

  const breakingNews = newsData?.slice(0, 1)[0];
  const trending = newsData?.slice(1, 4);

  return (
    <>
      <Nav />

      <main className="grow max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">All Gaming News</h1>
          <p className="text-slate-400 mt-1">
            Stay updated with the latest in gaming, reviews, and hardware.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-9 space-y-8 max-sm:order-2">
            {newsLoading ? (
              <div className="rounded-2xl aspect-21/9 overflow-hidden">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ bgcolor: "slate.900" }}
                  animation="wave"
                />
              </div>
            ) : (
              <article className="relative group overflow-hidden rounded-2xl aspect-21/9 flex max-md:aspect-auto items-end">
                <img
                  loading="lazy"
                  alt="Featured News"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={breakingNews?.image_url}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent"></div>
                <div className="relative p-4 h-full w-full flex flex-col">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-[10px] text-white font-bold uppercase tracking-wider rounded mb-3 w-fit">
                    Breaking News
                  </span>
                  <div className="flex-1">
                    <h2 className="text-2xl max-sm:text-xs font-bold leading-tight text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {breakingNews?.title}
                    </h2>
                    <p className="text-slate-200 mt-3 max-sm:text-sm text-lg line-clamp-2">
                      {breakingNews?.description || "No description available."}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center space-x-4">
                    <a href={breakingNews?.source_url}>
                      <button className="px-6 py-2.5 cursor-pointer bg-white text-black font-bold rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                        Read Article
                      </button>
                    </a>
                    <span className="text-sm text-slate-300">
                      {breakingNews?.pubDate.slice(0, 10)}
                    </span>
                  </div>
                </div>
              </article>
            )}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold border-b border-slate-800 pb-2">
                Recent Stories
              </h3>
              <div>
                <div className="relative group">
                  <input
                    className="bg-slate-800/50 border border-slate-700 text-sm rounded-lg py-2 px-4 w-1/2 focus:w-full transition-all duration-300 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Search news..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {newsLoading ? (
                <div className="grid grid-cols-1  gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="space-y-3 w-full">
                      <div className="flex gap-4">
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={200}
                          sx={{ bgcolor: "slate.900", flex: "1" }}
                        />
                        <div className="flex-1">
                          <Skeleton
                            variant="text"
                            width="80%"
                            sx={{ bgcolor: "slate.800" }}
                          />
                          <Skeleton
                            variant="text"
                            width="40%"
                            sx={{ bgcolor: "slate.800" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <NewsGallery
                  newsData={filteredItems}
                  search={searchQuery}
                  key={searchQuery}
                />
              )}
            </div>
          </section>
          <aside className="lg:col-span-3 space-y-8 max-sm:flex max-sm:flex-col max-sm:gap-8 ">
            <div className="glass-effect rounded-2xl p-6 max-sm:order-2">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <span className="w-1 h-5 bg-blue-500 rounded-full mr-3"></span>
                Categories
              </h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center cursor-pointer justify-between p-2 rounded-lg transition-colors font-medium ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white" // Active styles
                        : "text-blue-400 hover:bg-slate-800" // Inactive styles
                    }`}
                  >
                    <span>{cat.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            {trending?.length ? (
              <div className="glass-effect rounded-2xl p-6 contain-content max-md:order-1">
                <h4 className="font-bold text-lg mb-4 flex items-center">
                  <span className="w-1 h-5 bg-orange-500 rounded-full mr-3"></span>
                  Trending Now
                </h4>
                <div className="space-y-5 h-fit">
                  {newsLoading
                    ? // Skeleton list
                      [1, 2, 3].map((n) => (
                        <div key={n} className="flex space-x-3">
                          <Skeleton
                            variant="rounded"
                            width={64}
                            height={64}
                            sx={{ bgcolor: "slate.800" }}
                          />
                          <div className="flex-1 space-y-2">
                            <Skeleton
                              variant="text"
                              width="90%"
                              sx={{ bgcolor: "slate.800" }}
                            />
                            <Skeleton
                              variant="text"
                              width="60%"
                              sx={{ bgcolor: "slate.800" }}
                            />
                          </div>
                        </div>
                      ))
                    : trending?.map((news, index) => (
                        <a href={news.article_id} key={index} className="block">
                          <div className="flex space-x-3 group cursor-pointer">
                            <div className="w-16 h-16 bg-slate-700 rounded-lg shrink-0 overflow-hidden">
                              <img
                                loading="lazy"
                                className="w-full h-full object-cover"
                                src={news.image_url}
                              />
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold group-hover:text-blue-400 transition-colors line-clamp-6">
                                {news.title}
                              </h5>
                              <span className="text-[10px] text-slate-500">
                                by {news.creator || "Unknown Source"}
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
