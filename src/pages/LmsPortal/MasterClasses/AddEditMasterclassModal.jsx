import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Plus, Trash2, Video, CheckCircle, AlertCircle } from "lucide-react";
import { createMasterclass, updateMasterclass, fetchMasterclassBySlug, uploadMasterclassVideo } from "../API/masterclassApi";

export default function AddEditMasterclassModal({ masterclass, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    instructor: "",
    category: "",
    duration: "",
    status: "upcoming",
    badge: "",
    thumbnail: null,
    thumbnailUrl: "",
    startAt: "",
    registrationOpen: true,
    joinUrl: "",
    notes: "",
    about: "",
    whatWeLearn: "",
    whyMatters: "",
    year: new Date().getFullYear(),
    modules: 0,
    isPublic: true,
    whatThisSessionCovers: [""],
    keyTakeaways: [""],
    techStack: [""],
    trainerInfo: {
      name: "",
      info: "",
      image: "",
      linkedin: "",
      github: "",
      website: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(null);
  const [hasVideo, setHasVideo] = useState(false);
  const isEditing = !!masterclass;

  useEffect(() => {
    if (masterclass && masterclass._id) {
      loadMasterclassData();
    } else {
      // Generate slug from title when creating new
      if (!isEditing && formData.title) {
        const generatedSlug = formData.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        setFormData(prev => ({ ...prev, slug: generatedSlug }));
      }
    }
  }, [masterclass, formData.title]);

  const loadMasterclassData = async () => {
    try {
      setLoadingData(true);
      const masterclassData = await fetchMasterclassBySlug(masterclass.slug);
      if (masterclassData) {
        setFormData({
          title: masterclassData.title || "",
          slug: masterclassData.slug || "",
          description: masterclassData.description || "",
          instructor: masterclassData.instructor || "",
          category: masterclassData.category || "",
          duration: masterclassData.duration || "",
          status: masterclassData.status || "upcoming",
          badge: masterclassData.badge || "",
          thumbnail: null,
          thumbnailUrl: masterclassData.thumbnailUrl || "",
          startAt: masterclassData.startAt
            ? new Date(masterclassData.startAt).toISOString().slice(0, 16)
            : "",
          registrationOpen: masterclassData.registrationOpen !== undefined ? masterclassData.registrationOpen : true,
          joinUrl: masterclassData.joinUrl || "",
          notes: masterclassData.notes || "",
          about: masterclassData.about || "",
          whatWeLearn: masterclassData.whatWeLearn || "",
          whyMatters: masterclassData.whyMatters || "",
          year: masterclassData.year || new Date().getFullYear(),
          modules: masterclassData.modules || 0,
          isPublic: masterclassData.isPublic !== undefined ? masterclassData.isPublic : true,
          whatThisSessionCovers: masterclassData.whatThisSessionCovers && masterclassData.whatThisSessionCovers.length > 0
            ? masterclassData.whatThisSessionCovers
            : [""],
          keyTakeaways: masterclassData.keyTakeaways && masterclassData.keyTakeaways.length > 0
            ? masterclassData.keyTakeaways
            : [""],
          techStack: masterclassData.techStack && masterclassData.techStack.length > 0
            ? masterclassData.techStack
            : [""],
          trainerInfo: masterclassData.trainerInfo || {
            name: "",
            info: "",
            image: "",
            linkedin: "",
            github: "",
            website: "",
          },
        });
        setHasVideo(!!masterclassData.videoAssetId);
      }
    } catch (error) {
      console.error("Error loading masterclass:", error);
      setErrors({ submit: error.message || "Failed to load masterclass data" });
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
      if (files[0]) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: "" }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from title
      if (name === "title" && !isEditing) {
        const generatedSlug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        setFormData(prev => ({ ...prev, slug: generatedSlug }));
      }
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  const handleTrainerInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      trainerInfo: {
        ...prev.trainerInfo,
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor is required";
    }
    if (!formData.thumbnail && !formData.thumbnailUrl.trim()) {
      newErrors.thumbnail = "Thumbnail is required (either upload file or provide URL)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVideoUpload = async (masterclassId) => {
    if (!videoFile) return;

    try {
      setUploadingVideo(true);
      setVideoUploadProgress({ status: "uploading", message: "Uploading video..." });
      
      await uploadMasterclassVideo(masterclassId, videoFile);
      
      setVideoUploadProgress({ 
        status: "success", 
        message: "Video uploaded and converted to HLS successfully!" 
      });
      setHasVideo(true);
      setVideoFile(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setVideoUploadProgress(null);
      }, 3000);
    } catch (error) {
      console.error("Error uploading video:", error);
      setVideoUploadProgress({ 
        status: "error", 
        message: error.message || "Failed to upload video" 
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Filter out empty array items
      const payload = {
        ...formData,
        whatThisSessionCovers: formData.whatThisSessionCovers.filter(item => item.trim()),
        keyTakeaways: formData.keyTakeaways.filter(item => item.trim()),
        techStack: formData.techStack.filter(item => item.trim()),
      };

      let createdOrUpdatedMasterclass;
      if (isEditing) {
        createdOrUpdatedMasterclass = await updateMasterclass(masterclass._id, payload);
        
        // If status is "recorded" and video file is provided, upload video
        if (formData.status === "recorded" && videoFile) {
          await handleVideoUpload(masterclass._id);
          // Don't close modal immediately - let user see upload status
          setTimeout(() => {
            onClose();
          }, 2000);
          return;
        }
        
        alert("Masterclass updated successfully!");
      } else {
        createdOrUpdatedMasterclass = await createMasterclass(payload);
        
        // If status is "recorded" and video file is provided, upload video
        if (formData.status === "recorded" && videoFile) {
          // Get the masterclass ID from the response
          const masterclassId = createdOrUpdatedMasterclass?._id || createdOrUpdatedMasterclass?.masterclass?._id;
          if (masterclassId) {
            await handleVideoUpload(masterclassId);
            // Don't close modal immediately - let user see upload status
            setTimeout(() => {
              onClose();
            }, 2000);
            return;
          } else {
            alert("Masterclass created successfully! Please upload video manually.");
          }
        } else {
          alert("Masterclass created successfully!");
        }
      }

      onClose();
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} masterclass:`, error);
      setErrors({
        submit: error.message || `Failed to ${isEditing ? "update" : "create"} masterclass`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">
          <div className="text-gray-500">Loading masterclass data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Edit Master Class" : "Add Master Class"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.instructor && <p className="text-red-500 text-xs mt-1">{errors.instructor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 1h 30m"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="recorded">Recorded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="e.g., Upcoming Master Class"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Video Upload - Only for Recorded Masterclasses */}
          {formData.status === "recorded" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Video Upload (HLS Streaming)</h3>
              
              {hasVideo && !videoFile && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">Video already uploaded for this masterclass</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video File (MP4, AVI, MOV, WMV) - Max 500MB
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Video className="w-5 h-5" />
                    {videoFile ? videoFile.name : "Choose Video File"}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Check file size (500MB limit)
                          if (file.size > 500 * 1024 * 1024) {
                            alert("Video file size must be less than 500MB");
                            return;
                          }
                          setVideoFile(file);
                          setVideoUploadProgress(null);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {videoFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoUploadProgress(null);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Video will be automatically converted to HLS format for secure streaming
                </p>
              </div>

              {/* Video Upload Progress/Status */}
              {videoUploadProgress && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${
                  videoUploadProgress.status === "success" 
                    ? "bg-green-50 border border-green-200" 
                    : videoUploadProgress.status === "error"
                    ? "bg-red-50 border border-red-200"
                    : "bg-blue-50 border border-blue-200"
                }`}>
                  {videoUploadProgress.status === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : videoUploadProgress.status === "error" ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span className={`text-sm ${
                    videoUploadProgress.status === "success" 
                      ? "text-green-800" 
                      : videoUploadProgress.status === "error"
                      ? "text-red-800"
                      : "text-blue-800"
                  }`}>
                    {videoUploadProgress.message}
                  </span>
                </div>
              )}

              {/* Upload Video Button (for editing existing masterclass) */}
              {isEditing && videoFile && !uploadingVideo && (
                <button
                  type="button"
                  onClick={() => handleVideoUpload(masterclass._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Video Now
                </button>
              )}
            </div>
          )}

          {/* Thumbnail */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thumbnail</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail URL
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!!formData.thumbnail}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Upload Thumbnail
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5" />
                  {formData.thumbnail ? formData.thumbnail.name : "Choose File"}
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {formData.thumbnail && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: null }))}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>}
            </div>
          </div>

          {/* Schedule & Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Schedule & Links</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="startAt"
                  value={formData.startAt}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join URL (for live masterclasses)
                </label>
                <input
                  type="url"
                  name="joinUrl"
                  value={formData.joinUrl}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/..."
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="registrationOpen"
                  checked={formData.registrationOpen}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Registration Open</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Public</span>
              </label>
            </div>
          </div>

          {/* Content Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Content Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="4"
                placeholder="About this masterclass..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What We Learn
              </label>
              <textarea
                name="whatWeLearn"
                value={formData.whatWeLearn}
                onChange={handleChange}
                rows="4"
                placeholder="What you'll learn in this masterclass..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why It Matters
              </label>
              <textarea
                name="whyMatters"
                value={formData.whyMatters}
                onChange={handleChange}
                rows="3"
                placeholder="Why this masterclass matters..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes Title
              </label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Masterclass notes title"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Arrays */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Session Details</h3>
            
            {/* What This Session Covers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What This Session Covers
              </label>
              {formData.whatThisSessionCovers.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("whatThisSessionCovers", index, e.target.value)}
                    placeholder={`Coverage point ${index + 1}`}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.whatThisSessionCovers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("whatThisSessionCovers", index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("whatThisSessionCovers")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Coverage Point
              </button>
            </div>

            {/* Key Takeaways */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Takeaways
              </label>
              {formData.keyTakeaways.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("keyTakeaways", index, e.target.value)}
                    placeholder={`Takeaway ${index + 1}`}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.keyTakeaways.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("keyTakeaways", index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("keyTakeaways")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Takeaway
              </button>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tech Stack
              </label>
              {formData.techStack.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("techStack", index, e.target.value)}
                    placeholder={`Technology ${index + 1}`}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.techStack.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("techStack", index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("techStack")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Technology
              </button>
            </div>
          </div>

          {/* Trainer Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Trainer Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trainer Name
                </label>
                <input
                  type="text"
                  value={formData.trainerInfo.name}
                  onChange={(e) => handleTrainerInfoChange("name", e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trainer Image URL
                </label>
                <input
                  type="url"
                  value={formData.trainerInfo.image}
                  onChange={(e) => handleTrainerInfoChange("image", e.target.value)}
                  placeholder="https://example.com/trainer.jpg"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trainer Info/Bio
              </label>
              <textarea
                value={formData.trainerInfo.info}
                onChange={(e) => handleTrainerInfoChange("info", e.target.value)}
                rows="3"
                placeholder="Trainer information and bio..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.trainerInfo.linkedin}
                  onChange={(e) => handleTrainerInfoChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.trainerInfo.github}
                  onChange={(e) => handleTrainerInfoChange("github", e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.trainerInfo.website}
                  onChange={(e) => handleTrainerInfoChange("website", e.target.value)}
                  placeholder="https://example.com"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modules
              </label>
              <input
                type="number"
                name="modules"
                value={formData.modules}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Saving..." : isEditing ? "Update Master Class" : "Create Master Class"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

