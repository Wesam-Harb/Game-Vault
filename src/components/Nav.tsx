import { useState, useRef, useEffect } from "react";

//react router
import { Link } from "react-router";
import { useNavigate } from "react-router";

//MUI components
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";

export default function Nav() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      className="bg-game-dark/95 text-white h-full p-6 shadow-[0_10px_30px_rgba(15,23,42,0.45)]"
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <nav className="space-y-4 text-sm font-semibold text-slate-300">
        <Link
          to="/browseGames"
          className="block rounded-xl px-4 py-3 hover:bg-game-accent/20 hover:text-white transition-colors"
        >
          Browse Games
        </Link>
        <Link
          to="/favorite"
          className="block rounded-xl px-4 py-3 hover:bg-game-accent/20 hover:text-white transition-colors"
        >
          Favorites
        </Link>
        <Link
          to="/news"
          className="block rounded-xl px-4 py-3 hover:bg-game-accent/20 hover:text-white transition-colors"
        >
          News
        </Link>
      </nav>
    </Box>
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is NOT inside the search container AND there's no text
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        !searchQuery.trim()
      ) {
        setIsSearchOpen(false);
      }
    };

    // Add listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchQuery]); // Re-run if searchQuery changes so we have the latest value

  // Inside your Search Bar component:
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (isSearchOpen && searchQuery.trim()) {
      // Navigate and the Browse page's useEffect will handle the scroll
      navigate(`/browseGames?search=${encodeURIComponent(searchQuery)}`);
    } else {
      setIsSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-game-dark/80 backdrop-blur-md border-b border-gray-800"
        data-purpose="navigation-bar"
      >
        <div className="max-w-7xl mx-auto px-4 max-md:px-2 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-8 ">
            <Link
              className="text-2xl font-bold tracking-tighter text-game-accent"
              to={"/"}
            >
              GAME<span className="text-white">VAULT</span>
            </Link>

            <Drawer open={open} anchor="right" onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
            <nav className="max-md:hidden flex space-x-6 text-sm font-medium text-gray-400">
              <Link
                to={"/browseGames"}
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
          <div className="flex gap-2">
            <div
              className={`flex justify-end items-center h-10 will-change-[width] ${isSearchOpen ? "w-64 max-sm:w-40" : "w-10"}`}
            >
              <div
                ref={searchContainerRef}
                className={`
      relative flex items-center h-9 rounded-full transition-all duration-300 ease-out
      ${
        isSearchOpen
          ? "bg-slate-800/50 border border-slate-700 w-64 px-3 shadow-lg shadow-blue-500/10"
          : "w-10 bg-transparent border-transparent cursor-pointer"
      }
    `}
                onClick={handleSearchClick} // Clicking the container also triggers expansion
              >
                <input
                  ref={inputRef}
                  type="text"
                  className={`
        bg-transparent text-sm text-white outline-none w-full
        transition-opacity duration-200
        ${isSearchOpen ? "opacity-100" : "opacity-0 w-0 pointer-events-none"}
      `}
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button
                  className={`
        flex items-center justify-center transition-colors duration-200
        ${isSearchOpen ? "text-game-accent ml-2" : "text-gray-400 hover:text-white w-full h-full"}
      `}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="button"
              className="hidden max-md:flex items-center justify-center rounded-full p-2 text-game-accent hover:bg-white/5 transition-colors"
              onClick={toggleDrawer(true)}
              aria-label="Open navigation menu"
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
