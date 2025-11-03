import React from "react";
import overviewImg from "../assets/online-meetings.png"; // update if needed

const MasterClassIntroCard = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-start gap-6 sm:gap-8 mb-8">
      {/* Left: Circular Illustration */}
      <div className="flex items-center justify-center bg-[#fef4f4] rounded-full w-36 h-36 shadow-sm overflow-hidden">
        <img
          src={overviewImg}
          alt="Master Class Overview"
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Right: Red Card */}
      <div className="bg-[#a42025] text-white px-6 py-5 sm:px-8 sm:py-6 rounded-xl shadow-md w-full sm:w-[420px] flex flex-col justify-center text-center sm:text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">
            Master Class Overview
          </h2>

          {/* Centered and wrapped paragraph */}
          <p className="text-sm sm:text-base text-red-100 leading-relaxed max-w-sm mx-auto sm:mx-0">
            Monitor all events, track registrations, and see
            <br className="hidden sm:block" />
            student feedback in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MasterClassIntroCard;
