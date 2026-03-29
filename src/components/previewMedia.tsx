import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PreviewMedia({ gameName }: { gameName: string }) {
  const [images, setImages] = useState<{ image: string }[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_KEY = "key=62416f1743174897bf64cba4dec77848";
  useEffect(() => {
    fetch(`https://api.rawg.io/api/games/${gameName}/screenshots?${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        // We only need the first 4-5 screenshots for a quick preview
        setImages(data.results?.slice(0, 5) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [gameName, API_KEY]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images]);

  if (loading) {
    return (
      <div className="w-full h-44 bg-slate-700/50 animate-pulse rounded" />
    );
  }

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-44 overflow-hidden bg-black rounded shadow-inner">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[current]?.image} // Tells Framer this is a new element to animate
          src={images[current]?.image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-0.5 px-1 pb-1">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-full flex-1 transition-all duration-300 ${
              i === current ? "bg-white/80" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
