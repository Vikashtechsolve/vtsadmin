import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MessageSquare, X, Search, Filter } from "lucide-react";
import { fetchNews, deleteNews, fetchNewsComments, deleteComment } from "../API/newsApi";
import LmsHeader from "../LmsHeader";
import RightActivitySidebar from "../RightActivitySidebar";
import AddEditNewsModal from "./AddEditNewsModal";

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [expandedNewsId, setExpandedNewsId] = useState(null);
  const [newsComments, setNewsComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterCategory) params.category = filterCategory;
      
      const result = await fetchNews(params);
      setNews(result.news || []);
    } catch (err) {
      console.error("Error loading news:", err);
      setError(err.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (newsId) => {
    if (newsComments[newsId]) return; // Already loaded
    
    try {
      setLoadingComments(prev => ({ ...prev, [newsId]: true }));
      const comments = await fetchNewsComments(newsId);
      setNewsComments(prev => ({ ...prev, [newsId]: comments }));
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoadingComments(prev => ({ ...prev, [newsId]: false }));
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) {
      return;
    }
    try {
      await deleteNews(newsId);
      setNews(prev => prev.filter(n => n._id !== newsId));
      // Remove comments from state
      const newComments = { ...newsComments };
      delete newComments[newsId];
      setNewsComments(newComments);
    } catch (err) {
      console.error("Error deleting news:", err);
      alert("Failed to delete news. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId, newsId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    try {
      await deleteComment(commentId);
      setNewsComments(prev => ({
        ...prev,
        [newsId]: prev[newsId].filter(c => c._id !== commentId)
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const handleToggleExpand = (newsId) => {
    if (expandedNewsId === newsId) {
      setExpandedNewsId(null);
    } else {
      setExpandedNewsId(newsId);
      loadComments(newsId);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingNews(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingNews(null);
    loadNews();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(news.map(n => n.category).filter(Boolean))];

  return (
    <div className="flex gap-6 p-8 bg-gray-50 min-h-screen">
      {/* LEFT MAIN CONTENT */}
      <div className="flex-1">
        {/* HEADER */}
        <div className="mb-8">
          <LmsHeader />
        </div>

        {/* TITLE AND ACTIONS */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">News Management</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add News
          </button>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadNews()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setTimeout(loadNews, 100);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
          <button
            onClick={loadNews}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
          </div>

        {/* ERROR STATE */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading news...</div>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-4">No news articles found</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First News Article
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((newsItem) => (
              <div
                key={newsItem._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* NEWS HEADER */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {newsItem.image && (
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {newsItem.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {newsItem.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>By: {newsItem.author}</span>
                        <span>•</span>
                        <span>{formatDate(newsItem.date || newsItem.createdAt)}</span>
                        {newsItem.category && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {newsItem.category}
                            </span>
                          </>
                        )}
                        {newsItem.tags && newsItem.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {newsItem.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit News"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNews(newsItem._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete News"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
            </div>
          </div>

                {/* COMMENTS SECTION */}
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => handleToggleExpand(newsItem._id)}
                    className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">
                        Comments ({newsComments[newsItem._id]?.length || 0})
                      </span>
                    </div>
                    {expandedNewsId === newsItem._id ? (
                      <X className="w-5 h-5 text-gray-400" />
                    ) : (
                      <span className="text-gray-400">▼</span>
                    )}
                  </button>

                  {expandedNewsId === newsItem._id && (
                    <div className="px-6 py-4 bg-gray-50">
                      {loadingComments[newsItem._id] ? (
                        <div className="text-center text-gray-500 py-4">
                          Loading comments...
                        </div>
                      ) : !newsComments[newsItem._id] || newsComments[newsItem._id].length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          No comments yet
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {newsComments[newsItem._id].map((comment) => (
                            <div
                              key={comment._id}
                              className="bg-white border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {comment.avatar && (
                                      <img
                                        src={comment.avatar}
                                        alt={comment.authorName}
                                        className="w-8 h-8 rounded-full"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                        }}
                                      />
                                    )}
                                    <span className="font-medium text-gray-900">
                                      {comment.authorName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(comment.date || comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">{comment.text}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteComment(comment._id, newsItem._id)}
                                  className="ml-4 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Comment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[320px] shrink-0">
      <RightActivitySidebar />
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <AddEditNewsModal
          news={editingNews}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
