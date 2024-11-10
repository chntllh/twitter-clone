import { Outlet } from "react-router-dom";
import RightSidebar from "../components/func/RightSidebar.jsx";
import Sidebar from "../components/func/Sidebar.jsx";
import { Suspense } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

// const Layout = () => {
//   return (
//     <div className="flex flex-row mx-auto min-h-screen">
//       <div className="fixed top-0 left-0 h-screen md:w-16 lg:w-[22%] flex justify-center items-start lg:m-4">
//         <Sidebar />
//       </div>
//       <div className="border-x border-gray-600 w-full md:w-[70%] lg:w-[50%] lg:ml-[22%] md:ml-16">
//         <Suspense fallback={<LoadingSpinner />}>
//           <Outlet />
//         </Suspense>
//       </div>
//       <div className="hidden lg:w-[25%]">
//         <RightSidebar />
//       </div>
//     </div>
//   );
// };
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
