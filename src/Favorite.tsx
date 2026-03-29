import { useFavorites } from "./Hooks/useFavorites";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

//react router
import { Link } from "react-router";

export default function Favorite() {
  const { favorites, removeFavorite } = useFavorites();
  return (
    <>
      <Nav />
      <header
        className="relative px-4 py-6 md:px-12 bg-linear-to-b from-blue-900/20 to-game-dark"
        data-purpose="page-header"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
          <p className="text-gray-400">
            Manage and explore your curated list of games.
          </p>
        </div>
      </header>
      <main className="grow px-6 pb-20 md:px-12 max-w-7xl mx-auto w-full">
        <div
          className="grid grid-cols-1 my-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          id="favorites-grid"
        >
          {favorites.map(
            (fav) => (
              console.log(fav.metacritic),
              (
                <Link to={`/gameDetail/${fav.id}`} key={fav.id}>
                  <article
                    className="bg-game-card rounded-xl overflow-hidden shadow-lg card-hover border border-gray-800 group"
                    data-purpose="game-card"
                  >
                    <div className="relative aspect-3/4 max-sm:aspect-auto">
                      <img
                        alt="Elden Ring Cover Art"
                        className="w-full h-full object-cover"
                        src={fav.background_image}
                      />
                      <button
                        className="absolute z-10 top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        title="Remove from Favorites"
                        onClick={(e) => {
                          removeFavorite(fav.id);
                          e.preventDefault();
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white text-lg truncate mb-1">
                        {fav.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-yellow-400">
                          <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="ml-1 text-gray-300">
                            {fav.metacritic ? fav.metacritic / 10 : fav.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            ),
          )}
        </div>
        <section
          className="hidden flex-col items-center justify-center py-20 text-center"
          data-purpose="empty-state-view"
          id="empty-state"
        >
          <div className="w-64 h-64 mb-6 opacity-40">
            <svg
              className="w-full h-full text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your favorites list is empty
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start exploring and hit the heart icon to save your favorite games
            here for quick access later.
          </p>
          <a
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            href="#"
          >
            Discover Games
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
