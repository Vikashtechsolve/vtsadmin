import RightActivitySidebar from "../RightActivitySidebar";

import LmsHeader from "../LmsHeader";

export default function NewsSection() {
  return (
    <div className=" flex gap-6 p-8 bg-gray-50 min-h-screen">
     
      
      {/* LEFT MAIN CONTENT */}
      <div className="flex-1">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <LmsHeader/>
        </div>

        {/* NewsS TITLE */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-red-600">News</h2>
          <button className="text-xl">⋯</button>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-lg space-y-6 border">
          
          {/* News Heading */}
          <div>
            <label className="text-sm text-gray-500">News Heading</label>
            <input
              type="text"
              placeholder="News Heading"
              className="w-full mt-1 p-3 border rounded-md"
            />
          </div>

          {/* News Sub-heading */}
          <div>
            <label className="text-sm text-gray-500">News Sub-heading</label>
            <input
              type="text"
              placeholder="News Sub-heading"
              className="w-full mt-1 p-3 border rounded-md"
            />
          </div>

          {/* News Publisher */}
          <div>
            <label className="text-sm text-gray-500">News Publisher Name</label>
            <input
              type="text"
              placeholder="News Publisher Name"
              className="w-full mt-1 p-3 border rounded-md"
            />
          </div>

          {/* News Data Upload */}
          <div>
            <label className="text-sm text-gray-500">News Data Upload</label>
            <div className="mt-1 border rounded-md p-6 text-center text-gray-400 cursor-pointer">
              ☁ News File Upload / Link from GitHub
            </div>
          </div>

          {/* News Image Upload */}
          <div>
            <label className="text-sm text-gray-500">News Upload Image</label>
            <div className="mt-1 border rounded-md p-4 text-gray-400 cursor-pointer flex items-center gap-2">
              ⬆ Upload Image
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <RightActivitySidebar />
    </div>
  );
}
