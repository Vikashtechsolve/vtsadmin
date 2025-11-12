import React from "react";
import overviewImg from "../../assets/Problemsolving.png"; // ✅ Use your new image

const DoubtSolvingIntroCard = () => {
  return (
    <div
      className="relative flex items-center justify-between shadow-md"
      style={{
        backgroundColor: "#B11C20", // ✅ Same as image theme red
        width: "712px",
        height: "140px",
        borderRadius: "12px",
        padding: "24px 32px",
      }}
    >
      {/* ===== Left Text Section ===== */}
      <div className="text-white flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-1">Welcome Back,</h2>
        <p className="text-sm leading-relaxed text-white/90">
          Here’s today’s summary of all live 1:1 doubt solving activities!
        </p>
      </div>

      {/* ===== Right Image Section ===== */}
      <div className="flex items-center justify-end h-full">
        <img
          src={overviewImg}
          alt="Problem Solving Overview"
          className="h-[90px] w-auto object-contain"
        />
      </div>
    </div>
  );
};

export default DoubtSolvingIntroCard;
