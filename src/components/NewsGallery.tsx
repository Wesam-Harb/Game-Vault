import { useState, useMemo, memo } from "react";
import type { ApiResponse } from "../Types/NewsType";

//MUI component
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export function NewsGallery({
  newsData,
  search,
}: {
  newsData: ApiResponse[];
  search: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  //when newsData are mounted , assign the items to allItems
  const allItems = useMemo(() => {
    if (!newsData) return [];
    if (search) return newsData;
    else return newsData.slice(4, 50);
  }, [newsData, search]);

  const totalCount = Math.ceil(allItems.length / itemsPerPage); //get the pages number

  //get 3 items for every page
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return allItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [allItems, currentPage]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Smooth scroll to top when page changes to reduce "heavy" feeling
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginationComponent = useMemo(
    () => (
      <Stack spacing={6} sx={{ mt: 8 }}>
        <Pagination
          page={currentPage}
          onChange={handleChange}
          count={totalCount} // Corrected: Total number of PAGES, not items
          color="primary"
          shape="rounded"
          sx={{
            mx: "auto",
            "& .MuiPagination-ul": {
              width: "fit-content",
              mx: "auto",
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

  if (newsData.length === 0) {
    return (
      <div className="text-white p-10">No news found matching your search.</div>
    );
  }
  return (
    <div>
      <div className="space-y-6">
        {currentItems.map((item: ApiResponse) => (
          <NewsCard key={item.url} item={item} />
        ))}
      </div>

      {paginationComponent}
    </div>
  );
}

const NewsCard = memo(({ item }: { item: ApiResponse }) => {
  return (
    <article className="glass-effect rounded-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-52 group">
      <div className="w-full md:w-80 h-48 md:h-full overflow-hidden shrink-0">
        <img
          loading="lazy"
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={
            item.urlToImage ||
            "https://via.placeholder.com/400x250?text=No+Image"
          }
        />
      </div>
      <div className="p-6 flex flex-col justify-between grow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">
              {item.publishedAt.slice(0, 10)}
            </span>
          </div>
          <h4 className="text-xl font-bold group-hover:text-blue-400 transition-colors line-clamp-1">
            {item.title}
          </h4>
          <p className="text-sm text-slate-400 mt-2 line-clamp-3">
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-300">
              By {item.author || "Unknown"}
            </span>
          </div>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <button className="cursor-pointer text-sm font-semibold text-blue-400 hover:underline">
              Read More →
            </button>
          </a>
        </div>
      </div>
    </article>
  );
});
