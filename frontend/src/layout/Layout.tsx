import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import Sidebar from "./Sidebar";
import { Suspense } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Layout = () => {
  return (
    <div className="flex min-h-screen justify-center scrollbar-none overflow-y-auto max-h-screen">
      <div className="sticky top-0 z-10 border-r border-gray-600">
        <div className="hidden md:block md:w-16 xl:w-[220px]">
          <Sidebar />
        </div>
      </div>
      <div className="w-full sm:w-[600px]">
        <div className="">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
      <div className="sticky top-0 border-l border-gray-600">
        <div className="hidden lg:block lg:w-[240px] xl:w-[320px]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
