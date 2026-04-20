import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight, Calendar, Clock, Video, FileText } from "lucide-react";
import { fetchMasterclasses } from "../API/masterclassApi";

const MasterClasses = () => {
  const [masterclasses, setMasterclasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadMasterclasses();
  }, []);

  const loadMasterclasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMasterclasses({ limit: 6 }); // Get first 6 masterclasses
      setMasterclasses(result.items || []);
    } catch (err) {
      console.error("Error loading masterclasses:", err);
      setError("Failed to load masterclasses");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "live":
        return "bg-green-100 text-green-700";
      case "recorded":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex items-center px-6 py-4 justify-between border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">
            Recent Master Classes
          </h2>
          <button 
            onClick={() => navigate("/lmsDashboard/masterClasses")}
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            Manage Master Classes
          </button>
        </div>

        {/* Masterclasses Grid */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading masterclasses...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : masterclasses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">No masterclasses found</p>
            <button
              onClick={() => navigate("/lmsDashboard/masterClasses")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Master Class
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masterclasses.map((masterclass) => (
                <div
                  key={masterclass._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Thumbnail */}
                  {masterclass.thumbnailUrl && (
                    <div className="w-full h-40 bg-gray-200 overflow-hidden">
                      <img
                        src={masterclass.thumbnailUrl}
                        alt={masterclass.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 flex-1">
                        {masterclass.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(masterclass.status)}`}>
                        {masterclass.badge || masterclass.status}
                      </span>
                      {masterclass.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {masterclass.category}
                        </span>
                      )}
                    </div>
                    {masterclass.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {masterclass.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{masterclass.instructor}</span>
                      </div>
                      {masterclass.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{masterclass.duration}</span>
                        </div>
                      )}
                    </div>
                    {masterclass.startAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        Starts: {formatDate(masterclass.startAt)}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {masterclass.videoAssetId && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </div>
                      )}
                      {masterclass.notesAssetId && (
                        <div className="flex items-center gap-1 text-blue-600 text-xs">
                          <FileText className="w-3 h-3" />
                          <span>Notes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Masterclass Card */}
              <button
                onClick={() => navigate("/lmsDashboard/masterClasses")}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 p-8 hover:bg-gray-100 hover:border-blue-400 transition-colors min-h-[200px]"
              >
                <Plus className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Add New Master Class</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate("/lmsDashboard/masterClasses")}
          className="flex items-center gap-2 px-5 py-2 bg-[#F2F2F2] rounded-lg shadow-lg hover:bg-gray-50"
        >
          Manage Master Classes
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </>
  );
};

export default MasterClasses;

