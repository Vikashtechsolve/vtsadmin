import { useState } from "react";

export default function PlaylistTabs({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("videos");

  const handleTab = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex w-full justify-center gap-4 border-b border-[#E6E6E6] pb-4">
      {["videos", "notes", "ppt", "test"].map((tab) => (
        <button
          key={tab}
          onClick={() => handleTab(tab)}
          className={`px-6 py-2 rounded-lg border text-sm
            ${
              activeTab === tab
                ? "bg-red-600 text-white border-red-600"
                : "bg-gray-100 text-gray-500"
            }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
