import "./App.css";
import { Home } from "./Home";
import News from "./News";
import Platform from "./Platform";
import Favorite from "./Favorite";
import { GameDetail } from "./GameDetail";
import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { useLocation } from "react-router";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything UI-wise
}
function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/news" element={<News />} />
        <Route path="/platform/:family" element={<Platform />}></Route>
        <Route path="/browseGames" element={<Platform />}></Route>
        <Route path="/gameDetail/:id" element={<GameDetail />}></Route>
        <Route path="/favorite" element={<Favorite />}></Route>
      </Routes>
    </>
  );
}

export default App;
