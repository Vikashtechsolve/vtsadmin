import React, { useState, useEffect, useMemo } from "react";
import { Search, Mail, Phone, User, MessageSquare, Calendar, CheckCircle, Clock } from "lucide-react";

const ContactUs = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/contact`);
      const result = await response.json();

      if (result.success && result.data) {
        setSubmissions(result.data);
      } else if (Array.isArray(result)) {
        setSubmissions(result);
      }
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Map UI status to API status
      // API expects "responded" when marking as resolved
      const apiStatus = newStatus === "resolved" ? "responded" : newStatus;
      
      const response = await fetch(`${API_URL}/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: apiStatus }),
      });

      const result = await response.json();

      if (response.ok || result.success) {
        alert("Status updated successfully!");
        fetchSubmissions();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  // Group submissions by date
  const groupedSubmissions = useMemo(() => {
    const filtered = submissions.filter((submission) => {
      const matchesSearch =
        submission.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.queryType?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || 
        submission.status === filterStatus ||
        (filterStatus === "resolved" && submission.status === "responded");

      return matchesSearch && matchesStatus;
    });

    // Group by date
    const groups = {};
    filtered.forEach((submission) => {
      const date = new Date(submission.createdAt || submission.updatedAt);
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

    // Sort dates descending
    return Object.entries(groups)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .map(([date, items]) => ({
        date,
        items: items.sort(
          (a, b) =>
            new Date(b.createdAt || b.updatedAt) -
            new Date(a.createdAt || a.updatedAt)
        ),
      }));
  }, [submissions, searchQuery, filterStatus]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact submissions...</p>
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
            Contact Us Submissions
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            View all contact form submissions organized by date
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total: {submissions.length} submissions
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, phone, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="in-progress">In Progress</option>
        </select>
      </div>

      {/* Grouped Submissions */}
      {groupedSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No submissions found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedSubmissions.map((group) => (
            <div key={group.date} className="space-y-3">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Calendar size={18} className="text-red-600" />
                <span className="font-semibold text-gray-700">{group.date}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({group.items.length} {group.items.length === 1 ? "submission" : "submissions"})
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {group.items.map((submission) => (
                    <div
                      key={submission._id}
                      className="p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {submission.fullName}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                submission.status === "resolved" || submission.status === "responded"
                                  ? "bg-green-100 text-green-800"
                                  : submission.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {submission.status === "responded" ? "Responded" : submission.status || "pending"}
                            </span>
                            {submission.queryType && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {submission.queryType}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Mail size={14} />
                              {submission.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              {submission.phone}
                            </div>
                          </div>

                          {submission.message && (
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                              <div className="flex items-start gap-2">
                                <MessageSquare size={16} className="text-gray-400 mt-0.5" />
                                <p className="text-sm text-gray-700">{submission.message}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatDate(submission.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 cursor-pointer"
                          >
                            View
                          </button>
                          {submission.status !== "resolved" && submission.status !== "responded" && (
                            <button
                              onClick={() => handleStatusUpdate(submission._id, "resolved")}
                              className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <ContactDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

const ContactDetailModal = ({ submission, onClose, onStatusUpdate }) => {
  // Map API status "responded" to UI status "resolved" for display
  const getDisplayStatus = (apiStatus) => {
    return apiStatus === "responded" ? "resolved" : (apiStatus || "pending");
  };
  
  const [status, setStatus] = useState(getDisplayStatus(submission.status));
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onStatusUpdate(submission._id, newStatus);
    setStatus(newStatus);
    setUpdating(false);
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
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col my-8">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b text-white"
          style={{ background: "linear-gradient(90deg, #ED0331, #87021C)" }}
        >
          <div>
            <h2 className="text-xl font-semibold">Contact Submission Details</h2>
            <p className="text-sm text-white/90 mt-1">{submission.fullName}</p>
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
            <InfoField icon={<User size={18} />} label="Full Name" value={submission.fullName} />
            <InfoField icon={<Mail size={18} />} label="Email" value={submission.email} />
            <InfoField icon={<Phone size={18} />} label="Phone" value={submission.phone} />
            <InfoField icon={<MessageSquare size={18} />} label="Query Type" value={submission.queryType} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{submission.message}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 pt-4 border-t">
            <div>
              <span className="font-medium">Created:</span> {formatDate(submission.createdAt)}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {formatDate(submission.updatedAt)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
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

export default ContactUs;

