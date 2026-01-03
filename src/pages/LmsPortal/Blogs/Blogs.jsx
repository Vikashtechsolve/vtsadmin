import { useEffect, useState } from "react";
import { Plus, ArrowRight, Calendar, User } from "lucide-react";
import { fetchBlogs } from "../API/blogApi";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const result = await fetchBlogs({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' });
      setBlogs(result.blogs || []);
    } catch (error) {
      console.error("Error loading blogs:", error);
      setBlogs([]);
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
            Recently Added Blogs
          </h2>
          <button 
            onClick={() => navigate("/lmsDashboard/blogsSection")}
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            Edit Blogs
          </button>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">No blogs found</p>
            <button
              onClick={() => navigate("/lmsDashboard/blogsSection")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Blog
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate("/lmsDashboard/blogsSection")}
                >
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {blog.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(blog.date || blog.createdAt)}</span>
                      </div>
                    </div>
                    {blog.category && (
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {blog.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add Blog Card */}
              <button
                onClick={() => navigate("/lmsDashboard/blogsSection")}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 p-8 hover:bg-gray-100 hover:border-blue-400 transition-colors min-h-[200px]"
              >
                <Plus className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Add New Blog</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manage Blogs */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/lmsDashboard/blogsSection")}
          className="flex items-center gap-2 px-5 py-2 bg-[#F2F2F2] rounded-lg shadow-lg hover:bg-gray-50"
        >
          Manage Blogs
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </>
  );
};

export default Blogs;
