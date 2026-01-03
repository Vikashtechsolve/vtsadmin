import { useEffect, useState } from "react";
import { Plus, ArrowRight, Calendar, User } from "lucide-react";
import { fetchNews } from "../API/newsApi";
import { useNavigate } from "react-router-dom";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const result = await fetchNews({ limit: 6, sortBy: 'date', sortOrder: 'desc' });
      setNews(result.news || []);
    } catch (error) {
      console.error("Error loading news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex items-center px-6 py-4 justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">
            Recently Added News
          </h2>
          <button 
            onClick={() => navigate("/lmsDashboard/NewsSection")}
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            Edit News
          </button>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading news...
          </div>
        ) : news.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">No news articles found</p>
            <button
              onClick={() => navigate("/lmsDashboard/NewsSection")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First News Article
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((newsItem) => (
                <div
                  key={newsItem._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate("/lmsDashboard/NewsSection")}
                >
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {newsItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {newsItem.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{newsItem.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(newsItem.date || newsItem.createdAt)}</span>
                      </div>
                    </div>
                    {newsItem.category && (
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {newsItem.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add News Card */}
              <button
                onClick={() => navigate("/lmsDashboard/NewsSection")}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 p-8 hover:bg-gray-100 hover:border-blue-400 transition-colors min-h-[200px]"
              >
                <Plus className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Add New News</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manage News */}
      <div className="mt-6">
        <button 
          onClick={() => navigate("/lmsDashboard/NewsSection")}
          className="flex items-center gap-2 px-5 py-2 bg-[#F2F2F2] rounded-lg shadow-lg hover:bg-gray-50"
        >
          Manage News
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </>
  );
};

export default News;
