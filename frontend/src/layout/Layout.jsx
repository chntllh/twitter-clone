import { Outlet } from "react-router-dom";
import RightSidebar from "../components/func/RightSidebar.jsx";
import Sidebar from "../components/func/Sidebar.jsx";
import { Suspense } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

const Layout = () => {
  return (
    <div className="flex min-h-screen md:justify-center">
      <div className="hidden md:block md:w-16 lg:w-[250px]">
        <Sidebar />
      </div>
      <div className="border-x border-gray-600 md:w-[480px] lg:w-[600px]">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </div>
      <div className="hidden lg:block lg:w-[240px] xl:w-[300px]">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
