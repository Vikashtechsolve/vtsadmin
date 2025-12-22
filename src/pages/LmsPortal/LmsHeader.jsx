import { Bell, Search } from "lucide-react";

function LmsHeader() {
  return (
    <div className="flex items-center justify-between gap-6">

      {/* LEFT TITLE */}
      <h1 className="text-3xl font-semibold text-red-600">
        Dashboard
      </h1>

      {/* SEARCH BAR */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 w-[580px] h-16 shadow-md rounded-lg border border-gray-300">
        <Search size={24} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search here... "
          className="outline-none w-full text-sm"
        />
      </div>

      {/* NOTIFICATION */}
      <div className="hidden sm:flex w-11 h-11 items-center justify-center shadow-md border border-gray-200 rounded-full">
        <Bell className="text-gray-600" />
      </div>

    </div>
  );
}

export default LmsHeader;
