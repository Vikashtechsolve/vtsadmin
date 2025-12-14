import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MentorForm = ({ mentor, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    currentCompany: "",
    currentRole: "",
    aboutMentor: "",
    experience: "",
    rating: "",
    expertise: "",
    exCompanies: "",
    pastCompanyRoles: "",
    detailsToShowInPage: "",
    isActive: true,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (mentor) {
      setFormData({
        name: mentor.name || "",
        currentCompany: mentor.currentCompany || "",
        currentRole: mentor.currentRole || "",
        aboutMentor: mentor.aboutMentor || "",
        experience: mentor.experience || "",
        rating: mentor.rating || "",
        expertise: Array.isArray(mentor.expertise) ? mentor.expertise.join(", ") : (mentor.expertise || ""),
        exCompanies: Array.isArray(mentor.exCompanies) ? mentor.exCompanies.join(", ") : "",
        pastCompanyRoles: Array.isArray(mentor.pastCompanyRoles) ? mentor.pastCompanyRoles.join(", ") : "",
        detailsToShowInPage: Array.isArray(mentor.detailsToShowInPage) ? mentor.detailsToShowInPage.join(", ") : "",
        isActive: mentor.isActive !== undefined ? mentor.isActive : true,
        image: null,
      });
      if (mentor.image) {
        setPreview(mentor.image);
      }
    }
  }, [mentor]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = mentor
        ? `${API_URL}/api/mentors/${mentor._id || mentor.id}`
        : `${API_URL}/api/mentors`;

      // Prepare data - convert comma-separated strings to arrays
      const submitData = {
        name: formData.name,
        currentCompany: formData.currentCompany,
        currentRole: formData.currentRole,
        aboutMentor: formData.aboutMentor,
        experience: formData.experience ? Number(formData.experience) : 0,
        rating: formData.rating ? Number(formData.rating) : 0,
        expertise: formData.expertise ? formData.expertise.split(",").map(s => s.trim()).filter(s => s) : [],
        exCompanies: formData.exCompanies ? formData.exCompanies.split(",").map(s => s.trim()).filter(s => s) : [],
        pastCompanyRoles: formData.pastCompanyRoles ? formData.pastCompanyRoles.split(",").map(s => s.trim()).filter(s => s) : [],
        detailsToShowInPage: formData.detailsToShowInPage ? formData.detailsToShowInPage.split(",").map(s => s.trim()).filter(s => s) : [],
        isActive: formData.isActive,
      };

      // If there's an image file, use FormData, otherwise use JSON
      if (formData.image instanceof File) {
        const formDataToSend = new FormData();
        Object.keys(submitData).forEach(key => {
          if (Array.isArray(submitData[key])) {
            submitData[key].forEach((item, index) => {
              formDataToSend.append(`${key}[${index}]`, item);
            });
          } else {
            formDataToSend.append(key, submitData[key]);
          }
        });
        formDataToSend.append("image", formData.image);

        const response = await fetch(url, {
          method: mentor ? "PUT" : "POST",
          body: formDataToSend,
        });

        const result = await response.json();

        if (response.ok || result.success) {
          alert(mentor ? "Mentor updated successfully!" : "Mentor added successfully!");
          onSubmit();
        } else {
          setError(result.message || "Failed to save mentor");
        }
      } else {
        const response = await fetch(url, {
          method: mentor ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });

        const result = await response.json();

        if (response.ok || result.success) {
          alert(mentor ? "Mentor updated successfully!" : "Mentor added successfully!");
          onSubmit();
        } else {
          setError(result.message || "Failed to save mentor");
        }
      }
    } catch (err) {
      console.error("Error saving mentor:", err);
      setError("Failed to save mentor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col my-8"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b text-white"
            style={{ background: "linear-gradient(90deg, #ED0331, #87021C)" }}
          >
            <div>
              <h2 className="text-xl font-semibold">
                {mentor ? "Edit Mentor" : "Add New Mentor"}
              </h2>
              <p className="text-sm text-white/90 mt-1">
                {mentor ? "Update mentor details" : "Add mentor information"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mentor Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <Upload size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-700">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {preview && (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-red-200"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Google"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="e.g., 4.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Status
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Mentor is active</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expertise (comma separated) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
                placeholder="e.g., React, Node.js, System Design"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Companies (comma separated)
              </label>
              <input
                type="text"
                name="exCompanies"
                value={formData.exCompanies}
                onChange={handleChange}
                placeholder="e.g., Google, Microsoft"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Past Company Roles (comma separated)
              </label>
              <input
                type="text"
                name="pastCompanyRoles"
                value={formData.pastCompanyRoles}
                onChange={handleChange}
                placeholder="e.g., Software Engineer, Tech Lead"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details to Show on Pages (comma separated)
              </label>
              <input
                type="text"
                name="detailsToShowInPage"
                value={formData.detailsToShowInPage}
                onChange={handleChange}
                placeholder="e.g., home, resumereview"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Mentor <span className="text-red-500">*</span>
              </label>
              <textarea
                name="aboutMentor"
                value={formData.aboutMentor}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Write about the mentor..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ED0331] to-[#87021C] text-white hover:opacity-90 transition font-medium disabled:opacity-50 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  mentor ? "Update Mentor" : "Add Mentor"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MentorForm;

