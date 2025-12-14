import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, User, Briefcase, Building, Eye, Star, Award, MapPin, CheckCircle, X } from "lucide-react";
import MentorForm from "./components/MentorForm";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      // Note: You'll need to provide the actual API endpoint
      const response = await fetch(`${API_URL}/api/mentors`);
      const result = await response.json();

      if (result.success && result.data) {
        setMentors(result.data);
      } else {
        // Fallback for now - you can remove this once API is ready
        setMentors([]);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMentor(null);
    setShowForm(true);
  };

  const handleEdit = (mentor) => {
    setEditingMentor(mentor);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/mentors/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok || result.success) {
        alert(result.message || "Mentor deleted successfully!");
        fetchMentors();
      } else {
        alert(result.message || "Failed to delete mentor");
      }
    } catch (error) {
      console.error("Error deleting mentor:", error);
      alert("Error deleting mentor");
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/mentors/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setSelectedMentor(result.data);
      } else {
        alert("Failed to fetch mentor details");
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error);
      alert("Error fetching mentor details");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMentor(null);
  };

  const handleFormSubmit = () => {
    fetchMentors();
    handleFormClose();
  };

  const filteredMentors = mentors.filter((mentor) => {
    const searchLower = searchQuery.toLowerCase();
    const expertiseStr = Array.isArray(mentor.expertise) 
      ? mentor.expertise.join(" ").toLowerCase()
      : (mentor.expertise || "").toLowerCase();
    const currentCompany = (mentor.currentCompany || "").toLowerCase();
    const currentRole = (mentor.currentRole || "").toLowerCase();
    
    return (
      mentor.name?.toLowerCase().includes(searchLower) ||
      expertiseStr.includes(searchLower) ||
      currentCompany.includes(searchLower) ||
      currentRole.includes(searchLower) ||
      (mentor.aboutMentor || "").toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Mentor Details Management
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ED0331] to-[#87021C] text-white rounded-lg hover:opacity-90 transition font-medium cursor-pointer"
        >
          <Plus size={18} /> Add New Mentor
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search mentors by name, role, company, or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Mentors Grid */}
      {filteredMentors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No mentors found</p>
          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-[#ED0331] to-[#87021C] text-white rounded-lg hover:opacity-90 transition cursor-pointer"
          >
            Add Your First Mentor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id || mentor.id}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-red-300 transition-all duration-300"
            >
              {/* Mentor Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-red-50 to-red-100">
                {mentor.image ? (
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-[#ED0331] to-[#87021C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {mentor.name?.charAt(0) || "M"}
                    </div>
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {mentor.isActive ? (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <CheckCircle size={12} />
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-400 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <X size={12} />
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Mentor Info Section */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{mentor.name}</h3>
                  {mentor.currentRole && (
                    <p className="text-sm text-red-600 font-medium">{mentor.currentRole}</p>
                  )}
                  {mentor.currentCompany && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Building size={12} />
                      {mentor.currentCompany}
                    </p>
                  )}
                </div>

                {/* Rating */}
                {mentor.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{mentor.rating}</span>
                  </div>
                )}

                {/* Expertise Tags */}
                {mentor.expertise && Array.isArray(mentor.expertise) && mentor.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mentor.expertise.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{mentor.expertise.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Experience */}
                {mentor.experience && (
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Experience:</span> {mentor.experience} years
                  </div>
                )}

                {/* About Preview */}
                {mentor.aboutMentor && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {mentor.aboutMentor}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(mentor._id || mentor.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition font-medium text-sm cursor-pointer"
                    title="View Details"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(mentor)}
                    className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(mentor._id || mentor.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentor Form Modal */}
      {showForm && (
        <MentorForm
          mentor={editingMentor}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Mentor Details Modal */}
      {selectedMentor && (
        <MentorDetailModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onEdit={() => {
            setSelectedMentor(null);
            setEditingMentor(selectedMentor);
            setShowForm(true);
          }}
          onDelete={() => {
            handleDelete(selectedMentor._id || selectedMentor.id);
            setSelectedMentor(null);
          }}
        />
      )}
    </div>
  );
};

const MentorDetailModal = ({ mentor, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col my-8">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b text-white"
          style={{ background: "linear-gradient(90deg, #ED0331, #87021C)" }}
        >
          <div>
            <h2 className="text-xl font-semibold">Mentor Details</h2>
            <p className="text-sm text-white/90 mt-1">{mentor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Mentor Image */}
            <div className="md:col-span-1">
              {mentor.image ? (
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-64 object-cover rounded-xl border-2 border-red-200"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-[#ED0331] to-[#87021C] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {mentor.name?.charAt(0) || "M"}
                  </div>
                </div>
              )}
              {mentor.isActive !== undefined && (
                <div className="mt-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    mentor.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {mentor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{mentor.name}</h3>
                {mentor.currentRole && (
                  <p className="text-lg text-red-600 font-medium mb-1">{mentor.currentRole}</p>
                )}
                {mentor.currentCompany && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Building size={14} />
                    {mentor.currentCompany}
                  </p>
                )}
              </div>

              {mentor.rating && (
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-semibold text-gray-700">{mentor.rating}</span>
                  <span className="text-sm text-gray-500">Rating</span>
                </div>
              )}

              {mentor.experience && (
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-red-600" />
                  <span className="text-gray-700">
                    <span className="font-medium">{mentor.experience}</span> years of experience
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          {mentor.aboutMentor && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{mentor.aboutMentor}</p>
            </div>
          )}

          {/* Expertise */}
          {mentor.expertise && Array.isArray(mentor.expertise) && mentor.expertise.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Previous Companies */}
          {mentor.exCompanies && Array.isArray(mentor.exCompanies) && mentor.exCompanies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Previous Companies</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.exCompanies.map((company, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Past Company Roles */}
          {mentor.pastCompanyRoles && Array.isArray(mentor.pastCompanyRoles) && mentor.pastCompanyRoles.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Past Roles</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.pastCompanyRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details to Show */}
          {mentor.detailsToShowInPage && Array.isArray(mentor.detailsToShowInPage) && mentor.detailsToShowInPage.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Visible On Pages</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.detailsToShowInPage.map((page, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg"
                  >
                    {page}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium cursor-pointer"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-medium cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ED0331] to-[#87021C] text-white hover:opacity-90 transition font-medium flex items-center gap-2 cursor-pointer"
            >
              <Edit2 size={16} />
              Edit Mentor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;

