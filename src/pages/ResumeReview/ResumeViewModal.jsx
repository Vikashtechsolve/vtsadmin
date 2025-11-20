
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { CalendarDays, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ResumeViewModal = ({ session, onClose, onUpdate }) => {
  if (!session) return null;

  const baseUrl = import.meta.env.VITE_API_URL;

  const [mentorName, setMentorName] = useState(session.mentorName || "");
  const [status, setStatus] = useState(
    session.status.charAt(0).toUpperCase() + session.status.slice(1).toLowerCase()
  );

  const statuses = ["Pending", "Scheduled", "Live", "Completed"];

  const mentorsList = [
    "Aman Sharma",
    "Pooja Patel",
    "Rahul Gupta",
    "Sneha Desai",
    "No Mentor",
  ];

  const handleSubmit = async () => {
    try {
      const payload = { mentorName, status: status.toLowerCase() };

      const res = await fetch(`${baseUrl}/api/resume-review/${session._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        alert("Updated successfully!");

        //  RETURN updated session to parent
        onUpdate({
          ...session,
          mentorName,
          status: status.toLowerCase(),
        });

        onClose();
      } else {
        alert("Failed to update.");
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Error updating data.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/40 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Resume Review Details
            </h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 transition"
            >
              <IoClose size={26} />
            </button>
          </div>

          {/* BODY */}
          <div className="overflow-y-auto p-6 space-y-8 font-nunito">

            {/* STUDENT INFO CARD */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <h3 className="text-gray-700 font-semibold mb-3">Student Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReadOnlyField label="Name" value={session.name} />
                <ReadOnlyField label="Email" value={session.email} />
                <ReadOnlyField label="Mobile" value={session.mobile} />
                <div className="p-4  rounded-xl shadow-sm bg-white">
                  <label className="text-gray-700 font-semibold">Resume File</label>

                  {session.resume ? (
                    <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg mt-2">
                      <span className="text-gray-700 truncate w-2/3">
                        {session.resume.split("/").pop()}
                      </span>

                      <a
                        href={session.resume}
                        download
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Download size={18} /> Download
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 bg-gray-100 px-4 py-3 rounded-lg mt-2 italic">
                      No file uploaded
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CAREER GOAL */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <label className="text-gray-700 font-semibold">Career Goal</label>
              <textarea
                rows="3"
                readOnly
                value={session.careerGoal}
                className="input bg-gray-100 mt-2 cursor-not-allowed resize-none"
              />
            </div>

            {/* FILE SECTION */}


            {/* UPDATE SECTION */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <h3 className="text-gray-700 font-semibold mb-3">Update Details</h3>

              {/* ASSIGN MENTOR */}
              <div className="mb-4">
                <label className="label">Assign Mentor</label>
                <select
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">Select Mentor</option>
                  {mentorsList.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="label">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input mt-1"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div className="mt-4">
                <label className="label">Review Date</label>

                <div className="relative">
                  <CalendarDays size={18} className="absolute left-3 top-3 text-gray-400" />

                  <input
                    type="text"
                    value={session.date || session._groupDate || "—"}
                    className="input pl-10 bg-gray-100  mt-1"
                  />
                </div>
              </div>

              {/* TIME */}
              <div className="mt-4">
                <label className="label">Time</label>

                <input
                  type="text"
                  value={session.time || "—"}
                  className="input bg-gray-100 "
                />
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Close
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* Reusable Component */
const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="label">{label}</label>
    <input
      type="text"
      readOnly
      value={value}
      className="input bg-gray-100 cursor-not-allowed"
    />
  </div>
);

/* Tailwind Utilities */
const styles = `
.label { @apply block text-sm font-medium text-gray-700 mb-1; }
.input { @apply w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none; }
`;

export default ResumeViewModal;
