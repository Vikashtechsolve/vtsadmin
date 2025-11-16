// import React from "react";
// import { X, CalendarDays, Clock } from "lucide-react";

// const MentorshipViewModal = ({ session, onClose }) => {
//   if (!session) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
//       <div className="bg-white w-full max-w-md sm:max-w-lg rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//             Mentorship Session Details
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition"
//           >
//             <X size={22} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-5">
//           {/* Student Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Student Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={session.student || ""}
//               readOnly
//               className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
//             />
//           </div>

//           {/* Mentor */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Mentor <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={session.mentor || ""}
//               readOnly
//               className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
//             />
//           </div>

//           {/* Education */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Education Level
//             </label>
//             <input
//               type="text"
//               value={session.education || "—"}
//               readOnly
//               className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
//             />
//           </div>

//           {/* Subject / Plan + Time */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Subject / Plan
//               </label>
//               <input
//                 type="text"
//                 value={session.plan || "General Mentorship"}
//                 readOnly
//                 className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Scheduled Time
//               </label>
//               <div className="relative">
//                 <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="text"
//                   value={session.time || "—"}
//                   readOnly
//                   className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Doubt / Query */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Student Doubt / Query
//             </label>
//             <textarea
//               rows={3}
//               value={session.query || session.doubts || "No query provided"}
//               readOnly
//               className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed resize-none"
//             />
//           </div>

//           {/* Status */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Session Status
//             </label>
//             <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm flex items-center gap-2">
//               <span
//                 className={`h-3 w-3 rounded-full ${
//                   session.status === "Live"
//                     ? "bg-red-500"
//                     : session.status === "Completed"
//                     ? "bg-green-500"
//                     : session.status === "Scheduled"
//                     ? "bg-gray-400"
//                     : "bg-yellow-500"
//                 }`}
//               ></span>
//               <span className="capitalize">{session.status}</span>
//             </div>
//           </div>

//           {/* Session Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Session Date
//             </label>
//             <div className="relative">
//               <CalendarDays size={16} className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 value={session._groupDate || "—"}
//                 readOnly
//                 className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Registered Students */}
//           {session.registration && session.registration.length > 0 && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Registered Students
//               </label>
//               <div className="border rounded-xl divide-y">
//                 {session.registration.map((r, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
//                   >
//                     <div className="flex justify-between">
//                       <span className="font-medium">{r.name}</span>
//                       <span
//                         className={`text-xs px-2 py-0.5 rounded-full ${
//                           r.status === "Confirmed"
//                             ? "bg-green-100 text-green-600"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {r.status}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {r.email} • {r.mobile} • {r.graduationYear}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Footer */}
//           <div className="flex justify-end pt-4 border-t mt-6">
//             <button
//               onClick={onClose}
//               className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorshipViewModal;


import React, { useState } from "react";
import { X, CalendarDays, Clock, Download } from "lucide-react";

const MentorshipViewModal = ({ session, onClose, mentorsList  }) => {
  if (!session) return null;

  // Normalize incoming data
  const normalized = {
    ...session,
    mentor: session.mentor || session.mentorName || "",
    status:
      session.status.charAt(0).toUpperCase() +
      session.status.slice(1).toLowerCase(),
    date: session._groupDate || session.date || "",
    query: session.query || "",
  };

  const [form, setForm] = useState(normalized);
  const [loading, setLoading] = useState(false);

  // All possible statuses
  const statuses = ["Pending", "Scheduled", "Live", "Completed"];

  // Update fields
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Convert DD-MM-YYYY → YYYY-MM-DD
  const formatDateForBackend = (inputDate) => {
    if (!inputDate) return "";
    if (inputDate.includes("-")) {
      const [day, month, year] = inputDate.split("-");
      return `${day}-${month}-${year}`;
    }
    return inputDate;
  };

  // Submit PUT API
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        mentorName: form.mentor,
        query: form.query,
        status: form.status.toLowerCase(),
        date: formatDateForBackend(form.date),
        time: form.time,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mentorship/${session.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Updated Session:", data);

      setLoading(false);
      onClose(); // close modal after update
    } catch (e) {
      console.error("Error updating:", e);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Mentorship Session Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={form.student}
              readOnly
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              value={form.email || "—"}
              readOnly
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <input
              type="text"
              value={form.mobile || "—"}
              readOnly
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* MENTOR SELECT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentor
            </label>
            <select
              value={form.mentor}
              onChange={(e) => handleChange("mentor", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-800"
            >
              <option value="">Select Mentor</option>
              {mentorsList.length > 0 ? (
                mentorsList.map((m, index) => (
                  <option key={index} value={m}>
                    {m}
                  </option>
                ))
              ) : (
                <option>No mentors available</option>
              )}
            </select>
          </div>

          {/* QUERY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Query / Doubt
            </label>
            <textarea
              rows={3}
              value={form.query}
              onChange={(e) => handleChange("query", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white resize-none"
            />
          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Date
              </label>
              <div className="relative">
                <CalendarDays size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full pl-9 px-3 py-2.5 rounded-lg border border-gray-200 bg-white"
                />
              </div>
            </div>

            {/* TIME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Time
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="w-full pl-9 px-3 py-2.5 rounded-lg border border-gray-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* STATUS DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white"
            >
              {statuses.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* FILE DOWNLOAD */}
          {session.file && (
            <button
              onClick={() => window.open(session.file, "_blank")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
            >
              <Download size={18} />
              Download Attached File
            </button>
          )}

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Updating..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipViewModal;
