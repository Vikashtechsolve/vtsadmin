// import React from "react";

// const MasterClassDashboard = ({ data, onAddEvent, onEditEvent, onViewEvent ,upcomingEvents , pastEvents }) => {
//   return (
//     <>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
//         <h1 className="text-2xl sm:text-3xl font-bold text-red-500">
//           Master Classes Dashboard
//         </h1>
//         <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 border border-gray-100 w-full sm:w-96">
//           <span className="text-gray-400 text-lg mr-2">🔍</span>
//           <input
//             type="text"
//             placeholder="Search masterclass, mentor, or event..."
//             className="outline-none text-sm w-full bg-transparent"
//           />
//         </div>
//       </div>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
//         {[
//           {
//             icon: "📅",
//             title: "Upcoming Events",
//             desc: `${upcomingEvents.length} scheduled`,
//           },
//           {
//             icon: "🕒",
//             title: "Past Events",
//             desc: `${pastEvents.length} completed`,
//           },
//           {
//             icon: "👥",
//             title: "Total Registrations",
//             desc: `100+ students`,
//           },
//           {
//             icon: "⭐",
//             title: "Average Rating",
//             desc: `4.5 / 5`,
//           },
//         ].map((c, i) => (
//           <div
//             key={i}
//             className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
//           >
//             <div className="text-3xl mb-2">{c.icon}</div>
//             <p className="font-semibold text-gray-700">{c.title}</p>
//             <p className="text-sm text-gray-500">{c.desc}</p>
//           </div>
//         ))}
//       </div>

//       {/* Upcoming Events Table */}
//       <section className="mb-10 overflow-x-auto">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-lg font-semibold text-red-600">Upcoming Events</h2>
//           <button
//             onClick={onAddEvent}
//             className="text-sm text-red-600 hover:underline"
//           >
//             ➕ Add Event
//           </button>
//         </div>

//         <table className="w-full text-sm bg-white border border-gray-100 rounded-xl shadow-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="p-3 text-left">Event</th>
//               <th className="p-3 text-left">Mentor</th>
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Time</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {upcomingEvents.map((e) => (
//               <tr key={e._id} className="border-t hover:bg-gray-50">
//                 <td className="p-3">{e.eventTitle}</td>
//                 <td className="p-3">{e.mentorName}</td>
//                 <td className="p-3">{e.scheduleEventDate}</td>
//                 <td className="p-3">{e.scheduleEventTime}</td>
//                 <td className="p-3">{e.status}</td>
//                 <td className="p-3 space-x-2">
//                   <span
//                     className="text-blue-500 cursor-pointer hover:underline"
//                     onClick={() => onEditEvent(e)}
//                   >
//                     Edit
//                   </span>
//                   <span
//                     className="text-green-600 cursor-pointer hover:underline"
//                     onClick={() => onViewEvent(e._id)}
//                   >
//                     View
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* Past Events */}
//       <section className="overflow-x-auto">
//         <h2 className="text-lg font-semibold text-red-600 mb-3">Past Events</h2>
//         <table className="w-full text-sm bg-white border border-gray-100 rounded-xl shadow-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="p-3 text-left">Event</th>
//               <th className="p-3 text-left">Mentor</th>
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Students</th>
//               <th className="p-3 text-left">Rating</th>
//               <th className="p-3 text-left">Feedback</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pastEvents.map((e) => (
//               <tr key={e._id} className="border-t hover:bg-gray-50">
//                 <td className="p-3">{e.eventTitle}</td>
//                 <td className="p-3">{e.mentorName}</td>
//                 <td className="p-3">{e.scheduleEventDate}</td>
//                 <td className="p-3">{15}</td>
//                 <td className="p-3">{4.6} ⭐</td>
//                 <td
//                   className="p-3 text-blue-500 cursor-pointer hover:underline"
//                   onClick={() => onViewEvent(e.id)}
//                 >
//                   View
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </>
//   );
// };

// export default MasterClassDashboard;


import React from "react";

const MasterClassDashboard = ({
  data,
  onAddEvent,
  onEditEvent,
  onViewEvent,
  upcomingEvents,
  pastEvents,
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-500">
          Master Classes Dashboard
        </h1>
        <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 border border-gray-100 w-full sm:w-96">
          <span className="text-gray-400 text-lg mr-2">🔍</span>
          <input
            type="text"
            placeholder="Search masterclass, mentor, or event..."
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          {
            icon: "📅",
            title: "Upcoming Events",
            desc: `${upcomingEvents.length} scheduled`,
          },
          {
            icon: "🕒",
            title: "Past Events",
            desc: `${pastEvents.length} completed`,
          },
          { icon: "👥", title: "Total Registrations", desc: `100+ students` },
          { icon: "⭐", title: "Average Rating", desc: `4.5 / 5` },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{c.icon}</div>
            <p className="font-semibold text-gray-700">{c.title}</p>
            <p className="text-sm text-gray-500">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <section className="mb-10 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-red-600">Upcoming Events</h2>
          <button
            onClick={onAddEvent}
            className="text-sm text-red-600 hover:underline"
          >
            ➕ Add Event
          </button>
        </div>

        <table className="w-full text-sm bg-white border border-gray-100 rounded-xl shadow-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">Mentor</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.map((e) => (
              <tr key={e._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{e.eventTitle}</td>
                <td className="p-3">{e.mentorName}</td>
                <td className="p-3">{e.scheduleEventDate}</td>
                <td className="p-3">{e.scheduleEventTime}</td>
                <td className="p-3">{e.status}</td>
                <td className="p-3 space-x-2">
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => onEditEvent(e)}
                  >
                    Edit
                  </span>
                  <span
                    className="text-green-600 cursor-pointer hover:underline"
                    onClick={() => onViewEvent(e._id)} // ✅ FIXED HERE
                  >
                    View
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Past Events */}
      <section className="overflow-x-auto">
        <h2 className="text-lg font-semibold text-red-600 mb-3">Past Events</h2>
        <table className="w-full text-sm bg-white border border-gray-100 rounded-xl shadow-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">Mentor</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Students</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {pastEvents.map((e) => (
              <tr key={e._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{e.eventTitle}</td>
                <td className="p-3">{e.mentorName}</td>
                <td className="p-3">{e.scheduleEventDate}</td>
                <td className="p-3">{15}</td>
                <td className="p-3">{4.6} ⭐</td>
                <td
                  className="p-3 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => onViewEvent(e._id)} // ✅ FIXED HERE
                >
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default MasterClassDashboard;
