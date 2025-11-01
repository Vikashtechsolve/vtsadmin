// src/pages/MasterClasses.jsx
import React from "react";
import { Link } from "react-router-dom";

const MasterClasses = () => {
  const classes = [
    {
      id: 1,
      title: "Full-Stack Web Development",
      description:
        "Master front-end and back-end development with hands-on projects using React, Node.js, and MongoDB.",
      instructor: "Vikash Sharma",
      date: "Nov 15, 2025",
      duration: "6 Weeks",
    },
    {
      id: 2,
      title: "Advanced Java with Spring Boot",
      description:
        "Deep dive into Spring Boot, REST APIs, and microservices architecture with real-world examples.",
      instructor: "Mustakim Shaikh",
      date: "Nov 20, 2025",
      duration: "5 Weeks",
    },
    {
      id: 3,
      title: "Python for Data Science",
      description:
        "Learn data analysis, visualization, and machine learning with Python, Pandas, and Scikit-learn.",
      instructor: "Ravi Kumar",
      date: "Dec 1, 2025",
      duration: "4 Weeks",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🎓 Master Classes</h1>
        <p className="text-gray-500 mt-2">
          Explore expert-led sessions to advance your skills in technology and development.
        </p>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-200"
          >
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              {cls.title}
            </h2>
            <p className="text-gray-600 text-sm mb-3">{cls.description}</p>

            <div className="text-sm text-gray-500 mb-2">
              <span className="block">
                👨‍🏫 <strong>Instructor:</strong> {cls.instructor}
              </span>
              <span className="block">
                📅 <strong>Start Date:</strong> {cls.date}
              </span>
              <span className="block">
                ⏱️ <strong>Duration:</strong> {cls.duration}
              </span>
            </div>

            <Link
              to={`/programs/master-classes/${cls.id}`}
              className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterClasses;
