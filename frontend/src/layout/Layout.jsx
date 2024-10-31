import { Outlet } from "react-router-dom";
import RightSidebar from "../components/ui/RightSidebar.jsx";
import Sidebar from "../components/ui/Sidebar.jsx";

const Layout = () => {
  return (
    <div className="flex flex-row mx-auto min-h-screen">
      <div className="fixed top-0 left-0 h-screen md:w-16 lg:w-[22%] flex justify-center items-start lg:m-4">
        <Sidebar />
      </div>
      <div className="border-x border-gray-600 w-full md:w-[70%] lg:w-[50%] lg:ml-[22%] md:ml-16">
        <Outlet />
      </div>
      <div className="hidden lg:w-[25%]">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
