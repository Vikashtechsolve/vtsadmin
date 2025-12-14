import React, { useState, useEffect, useMemo } from "react";
import { Search, Download, Calendar, Phone, Mail, GraduationCap, Briefcase, MapPin, DollarSign, Eye, EyeOff, Trash2, CheckCircle } from "lucide-react";

const JoinUs = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/joinus`);
      const result = await response.json();

      if (result.success && result.data) {
        setSubmissions(result.data);
      } else if (Array.isArray(result)) {
        setSubmissions(result);
      }
    } catch (error) {
      console.error("Error fetching join us submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSeen = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/joinus/${id}/seen`, {
        method: "PATCH",
      });
      const result = await response.json();

      if (result.success || response.ok) {
        alert("Marked as seen successfully!");
        fetchSubmissions();
      } else {
        alert(result.message || "Failed to mark as seen");
      }
    } catch (error) {
      console.error("Error marking as seen:", error);
      alert("Failed to mark as seen. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/joinus/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success || response.ok) {
        alert("Submission deleted successfully!");
        fetchSubmissions();
      } else {
        alert(result.message || "Failed to delete submission");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission. Please try again.");
    }
  };

  const handleDownloadResume = (resumeUrl, name) => {
    if (!resumeUrl) {
      alert("Resume URL not available");
      return;
    }

    try {
      // Check if it's a full URL or relative path
      const url = resumeUrl.startsWith("http") 
        ? resumeUrl 
        : `${API_URL}${resumeUrl}`;
      
      // Open in new tab for download
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume. Please try again.");
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      submission.name?.toLowerCase().includes(searchLower) ||
      submission.qualification?.toLowerCase().includes(searchLower) ||
      submission.subject?.toLowerCase().includes(searchLower) ||
      submission.location?.toLowerCase().includes(searchLower)
    );
  });

  // Group submissions by date
  const groupedSubmissions = useMemo(() => {
    const groups = {};
    filteredSubmissions.forEach((submission) => {
      if (!submission.createdAt) return;
      
      const date = new Date(submission.createdAt);
      const dateKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(submission);
    });

    // Sort dates in descending order (newest first)
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB - dateA;
    });

    return sortedKeys.reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
  }, [filteredSubmissions]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const parseJsonField = (field) => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return Array.isArray(field) ? field : [field];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Join Us Submissions
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            View all form submissions from the Join Us page
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total: {submissions.length} submissions
        </div>
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
            placeholder="Search by name, qualification, subject, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Submissions grouped by date */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No submissions found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSubmissions).map(([dateKey, dateSubmissions]) => (
            <div key={dateKey} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Calendar size={18} className="text-red-600" />
                <span className="font-semibold text-gray-700">{dateKey}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({dateSubmissions.length} {dateSubmissions.length === 1 ? "submission" : "submissions"})
                </span>
              </div>

              {/* Table Container */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Table for this date */}
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Qualification
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dateSubmissions.map((submission, index) => (
                      <tr 
                        key={submission._id || index} 
                        className={`hover:bg-gray-50 ${submission.isSeen ? "bg-gray-50/50" : "bg-white"}`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.name}
                            </div>
                            {!submission.isSeen && (
                              <span className="w-2 h-2 bg-red-500 rounded-full" title="Unread"></span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Phone size={12} />
                            {submission.contactNo}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {submission.qualification}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Passing: {submission.passingYear}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            Total: {submission.totalExperience} years
                          </div>
                          <div className="text-xs text-gray-500">
                            Teaching: {submission.teachingExperience} | Dev: {submission.developmentExperience}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {submission.subject}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 flex items-center gap-1">
                            <MapPin size={14} />
                            {submission.location}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                              submission.isSeen
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {submission.isSeen ? (
                              <>
                                <CheckCircle size={12} />
                                Seen
                              </>
                            ) : (
                              <>
                                <EyeOff size={12} />
                                Unseen
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {submission.resumeUrl && (
                              <button
                                onClick={() => handleDownloadResume(submission.resumeUrl, submission.name)}
                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition cursor-pointer"
                                title="Download Resume"
                              >
                                <Download size={16} />
                              </button>
                            )}
                            {!submission.isSeen && (
                              <button
                                onClick={() => handleMarkAsSeen(submission._id)}
                                className="text-green-600 hover:text-green-800 p-1.5 rounded hover:bg-green-50 transition cursor-pointer"
                                title="Mark as Seen"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="text-purple-600 hover:text-purple-800 p-1.5 rounded hover:bg-purple-50 transition cursor-pointer"
                              title="View Details"
                            >
                              <Calendar size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(submission._id)}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <JoinUsDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onMarkAsSeen={handleMarkAsSeen}
          onDelete={handleDelete}
          onDownloadResume={handleDownloadResume}
          onRefresh={fetchSubmissions}
        />
      )}
    </div>
  );
};

const JoinUsDetailModal = ({ submission, onClose, onMarkAsSeen, onDelete, onDownloadResume, onRefresh }) => {
  const parseJsonField = (field) => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return Array.isArray(field) ? field : [field];
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col my-8">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b text-white"
          style={{ background: "linear-gradient(90deg, #ED0331, #87021C)" }}
        >
          <div>
            <h2 className="text-xl font-semibold">Join Us Submission Details</h2>
            <p className="text-sm text-white/90 mt-1">{submission.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField icon={<GraduationCap size={18} />} label="Name" value={submission.name} />
            <InfoField icon={<Mail size={18} />} label="Contact" value={submission.contactNo} />
            <InfoField icon={<GraduationCap size={18} />} label="Qualification" value={submission.qualification} />
            <InfoField icon={<Calendar size={18} />} label="Passing Year" value={submission.passingYear} />
            <InfoField icon={<Briefcase size={18} />} label="Subject" value={submission.subject} />
            <InfoField icon={<Briefcase size={18} />} label="Total Experience" value={`${submission.totalExperience} years`} />
            <InfoField icon={<Briefcase size={18} />} label="Teaching Experience" value={`${submission.teachingExperience} years`} />
            <InfoField icon={<Briefcase size={18} />} label="Development Experience" value={`${submission.developmentExperience} years`} />
            <InfoField icon={<MapPin size={18} />} label="Location" value={submission.location} />
            <InfoField icon={<DollarSign size={18} />} label="Payout Expectations" value={`₹${submission.payoutExpectations}`} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Looking For</label>
            <div className="flex flex-wrap gap-2">
              {parseJsonField(submission.workLookingFor).map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
            <div className="flex flex-wrap gap-2">
              {parseJsonField(submission.mode).map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {submission.resumeUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
              <button
                onClick={() => {
                  onDownloadResume(submission.resumeUrl, submission.name);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ED0331] to-[#87021C] text-white rounded-lg hover:opacity-90 transition cursor-pointer"
              >
                <Download size={18} /> Download Resume
              </button>
            </div>
          )}

          {submission.createdAt && (
            <div className="text-sm text-gray-500 pt-4 border-t">
              Submitted: {formatDate(submission.createdAt)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            {!submission.isSeen && (
              <button
                onClick={() => {
                  onMarkAsSeen(submission._id);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium cursor-pointer"
              >
                <Eye size={16} />
                Mark as Seen
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this submission?")) {
                  onDelete(submission._id);
                  onClose();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium cursor-pointer"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-gray-500">{icon}</div>
    <div className="flex-1">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
        {value || "—"}
      </div>
    </div>
  </div>
);

export default JoinUs;

