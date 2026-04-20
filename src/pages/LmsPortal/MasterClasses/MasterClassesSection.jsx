import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Filter, Video, FileText, Calendar, Clock, Upload, X } from "lucide-react";
import { fetchMasterclasses, deleteMasterclass, uploadMasterclassVideo } from "../API/masterclassApi";
import LmsHeader from "../LmsHeader";
import RightActivitySidebar from "../RightActivitySidebar";
import AddEditMasterclassModal from "./AddEditMasterclassModal";

export default function MasterClassesSection() {
  const [masterclasses, setMasterclasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMasterclass, setEditingMasterclass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [uploadingVideoId, setUploadingVideoId] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState({});
  const videoInputRefs = useRef({});

  useEffect(() => {
    loadMasterclasses();
  }, []);

  const loadMasterclasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus) params.status = filterStatus;
      if (filterCategory) params.category = filterCategory;
      
      const result = await fetchMasterclasses(params);
      setMasterclasses(result.items || []);
    } catch (err) {
      console.error("Error loading masterclasses:", err);
      setError(err.message || "Failed to load masterclasses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMasterclass = async (masterclassId) => {
    if (!window.confirm("Are you sure you want to delete this masterclass?")) {
      return;
    }
    try {
      await deleteMasterclass(masterclassId);
      setMasterclasses(prev => prev.filter(m => m._id !== masterclassId));
    } catch (err) {
      console.error("Error deleting masterclass:", err);
      alert("Failed to delete masterclass. Please try again.");
    }
  };

  const handleVideoFileSelect = (masterclassId, file) => {
    if (!file) return;
    
    // Check file size (500MB limit)
    if (file.size > 500 * 1024 * 1024) {
      alert("Video file size must be less than 500MB");
      return;
    }

    // Check if masterclass status is recorded
    const masterclass = masterclasses.find(m => m._id === masterclassId);
    if (masterclass && masterclass.status !== "recorded") {
      alert("Video can only be uploaded for masterclasses with 'recorded' status. Please change the status to 'recorded' first.");
      return;
    }

    handleVideoUpload(masterclassId, file);
  };

  const handleVideoUpload = async (masterclassId, videoFile) => {
    if (!videoFile) {
      alert("Please select a video file");
      return;
    }

    try {
      setUploadingVideoId(masterclassId);
      setVideoUploadProgress(prev => ({
        ...prev,
        [masterclassId]: { status: "uploading", message: "Uploading video..." }
      }));

      await uploadMasterclassVideo(masterclassId, videoFile);
      
      setVideoUploadProgress(prev => ({
        ...prev,
        [masterclassId]: { status: "success", message: "Video uploaded successfully!" }
      }));

      // Reload masterclasses to get updated video status
      await loadMasterclasses();

      // Clear progress after 3 seconds
      setTimeout(() => {
        setVideoUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[masterclassId];
          return newProgress;
        });
      }, 3000);
    } catch (error) {
      console.error("Error uploading video:", error);
      setVideoUploadProgress(prev => ({
        ...prev,
        [masterclassId]: { status: "error", message: error.message || "Failed to upload video" }
      }));
    } finally {
      setUploadingVideoId(null);
    }
  };

  const handleEdit = (masterclass) => {
    setEditingMasterclass(masterclass);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingMasterclass(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingMasterclass(null);
    loadMasterclasses();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
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

  // Get unique categories and statuses for filters
  const categories = [...new Set(masterclasses.map(m => m.category).filter(Boolean))];
  const statuses = ["upcoming", "live", "recorded"];

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
          <h2 className="text-2xl font-semibold text-gray-800">Master Classes Management</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Master Class
          </button>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search masterclasses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadMasterclasses()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {statuses.length > 0 && (
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setTimeout(loadMasterclasses, 100);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          )}
          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setTimeout(loadMasterclasses, 100);
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
            onClick={loadMasterclasses}
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
            <div className="text-gray-500">Loading masterclasses...</div>
          </div>
        ) : masterclasses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-4">No masterclasses found</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Master Class
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {masterclasses.map((masterclass) => (
              <div
                key={masterclass._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* MASTERCLASS HEADER */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {masterclass.thumbnailUrl && (
                      <img
                        src={masterclass.thumbnailUrl}
                        alt={masterclass.title}
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {masterclass.title}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(masterclass.status)}`}>
                              {masterclass.badge || masterclass.status}
                            </span>
                            {masterclass.category && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {masterclass.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEdit(masterclass)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Edit Master Class"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          {masterclass.status === "recorded" && (
                            <label className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer" title="Upload Video">
                              <Video className="w-5 h-5" />
                              <input
                                type="file"
                                accept="video/*"
                                ref={(el) => {
                                  if (el) videoInputRefs.current[masterclass._id] = el;
                                }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    handleVideoFileSelect(masterclass._id, file);
                                  }
                                  // Reset input so same file can be selected again
                                  e.target.value = "";
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                          <button
                            onClick={() => handleDeleteMasterclass(masterclass._id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete Master Class"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {masterclass.description}
                      </p>
                      
                      {/* Video Upload Progress/Status */}
                      {videoUploadProgress[masterclass._id] && (
                        <div className={`mb-3 p-3 rounded-lg flex items-center gap-2 text-sm ${
                          videoUploadProgress[masterclass._id].status === "success" 
                            ? "bg-green-50 text-green-800" 
                            : videoUploadProgress[masterclass._id].status === "error"
                            ? "bg-red-50 text-red-800"
                            : "bg-blue-50 text-blue-800"
                        }`}>
                          {videoUploadProgress[masterclass._id].status === "uploading" && (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          )}
                          {videoUploadProgress[masterclass._id].status === "success" && (
                            <Video className="w-4 h-4" />
                          )}
                          {videoUploadProgress[masterclass._id].status === "error" && (
                            <X className="w-4 h-4" />
                          )}
                          <span>{videoUploadProgress[masterclass._id].message}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Instructor: {masterclass.instructor}</span>
                        </div>
                        {masterclass.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{masterclass.duration}</span>
                          </div>
                        )}
                        {masterclass.startAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Starts: {formatDate(masterclass.startAt)}</span>
                          </div>
                        )}
                        {masterclass.videoAssetId && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Video className="w-4 h-4" />
                            <span>Video Available</span>
                          </div>
                        )}
                        {masterclass.notesAssetId && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <FileText className="w-4 h-4" />
                            <span>Notes Available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
        <AddEditMasterclassModal
          masterclass={editingMasterclass}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

