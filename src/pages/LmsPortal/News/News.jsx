import { useEffect, useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { fetchNews } from "../API/newsApi";

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews().then(setNews);
  }, []);

  return (
    <>
      <div className="bg-gray-100 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center px-2 justify-between mb-4">
          <h2 className="font-semibold mt-4 text-gray-800">
            Recently Added News
          </h2>
          <button className="text-blue-600 underline text-sm">
            Edit News
          </button>
        </div>

        {/* 👇 MOBILE SCROLL ONLY */}
        <div className="overflow-x-auto md:overflow-visible scrollbar-hide">
          <div
            className="
              grid
              grid-flow-col
              auto-cols-[150px]

              md:grid-flow-row
              md:auto-cols-auto
              md:grid-cols-3
              lg:grid-cols-6

              border
              rounded-lg
            "
          >
            {news.map((item) => (
              <div
                key={item.id}
                className="
                  p-4
                  text-xs
                  text-gray-500
                  border-r
                  border-b
                  flex
                  items-center
                  justify-center
                  text-center
                  bg-gray-50
                "
              >
                {item.name}
              </div>
            ))}

            {/* Add News */}
            <button
              className="
                flex
                items-center
                justify-center
                bg-gray-50
                border
                gap-2
                text-sm
                text-gray-700
                hover:bg-gray-100
                p-3
              "
            >
              <Plus className="w-4 h-4 text-red-600" />
              Add News
            </button>
          </div>
        </div>
      </div>

      {/* Manage News */}
      <div className="mt-6">
        <button className="flex items-center gap-2 px-5 py-2 bg-[#F2F2F2] rounded-lg shadow-lg hover:bg-gray-50">
          Manage News
          <ArrowRight className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </>
  );
};

export default News;
