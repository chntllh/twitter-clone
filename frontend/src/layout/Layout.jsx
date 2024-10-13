import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
  return (
    <div className='flex flex-row mx-auto  min-h-screen'>
      <div className='lg:w-[22%] flex justify-center items-start lg:m-4'>
        <Sidebar />
      </div>
      <div className='border-x border-gray-600 w-full md:w-[70%] lg:w-[50%]'>
        <Outlet />
      </div>
      <div className='hidden lg:w-[25%]'>
        <RightSidebar />
      </div>
    </div>
  );
}
