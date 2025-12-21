import { Outlet } from "react-router-dom";
import LmsHeader from "./pages/LmsPortal/LmsHeader";
import RightActivitySidebar from "./pages/LmsPortal/RightActivitySidebar";

const LmsLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* CENTER AREA */}
      <div className="flex-1 flex flex-col px-8 pt-6">
        
        {/* HEADER */}
        <LmsHeader />

        {/* PAGE CONTENT */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      {/* <div className="hidden xl:block w-[320px] border-l bg-white pt-6">
        <RightActivitySidebar />
      </div> */}

    </div>
  );
};

export default LmsLayout;
