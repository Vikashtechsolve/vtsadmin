const StatCard = ({ title, value, icon }) => {
  return (
    <div
      className="
        flex items-center sm:items-start 
        gap-3 sm:gap-4
        bg-white 
        p-4 sm:p-5 
        rounded-xl 
        shadow-sm hover:shadow-md 
        transition
      "
    >
      {/* ICON */}
      <div
        className="
          w-10 h-10 sm:w-12 sm:h-12 
          flex items-center justify-center 
          rounded-full 
          bg-red-100 
          text-red-600 
          text-lg sm:text-xl
          flex-shrink-0
        "
      >
        {icon}
      </div>

      {/* TEXT */}
      <div>
        <p className="text-xs sm:text-sm text-gray-500 leading-tight">
          {title}
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {value}
        </h2>
      </div>
    </div>
  );
};

export default StatCard;
