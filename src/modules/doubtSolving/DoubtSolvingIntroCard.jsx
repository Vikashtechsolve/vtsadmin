import React from "react";
import overviewImg from "../../assets/online-meetings.png";

const DoubtSolvingIntroCard = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-start gap-6 sm:gap-8 mb-8">
      <div className="flex items-center justify-center bg-[#fef4f4] rounded-full w-36 h-36 shadow-sm overflow-hidden">
        <img src={overviewImg} alt="Doubt Solving" className="w-24 h-24 object-contain" />
      </div>

      <div className="bg-[#a42025] text-white px-6 py-5 sm:px-8 sm:py-6 rounded-xl shadow-md w-full sm:w-[420px]">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Doubt Solving Overview</h2>
        <p className="text-sm sm:text-base text-red-100 leading-relaxed">
          See all scheduled 1:1 doubt sessions, track live status, and drill into session details.
        </p>
      </div>
    </div>
  );
};

export default DoubtSolvingIntroCard;
