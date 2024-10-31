import { NavLink } from "react-router-dom";
import SidebarNavigationButton from "../ui/SidebarNavigationButton.jsx";
import { BiBell, BiHome, BiSearch, BiSolidCog, BiUser } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import ProfileCard from "../ui/ProfileCard.jsx";

const Sidebar = () => {
  return (
    <div className="sticky top-0 hidden md:block h-screen">
      <div className="flex flex-col h-full lg:w-[90%] gap-2 items-center lg:items-start">
        <div className="ml-1 lg:ml-2 mt-6 lg:mt-4">
          <FaXTwitter className="hidden lg:block" size={48} />
          <FaXTwitter className="block lg:hidden" size={32} />
        </div>

        <SidebarNavigationButton
          destination="/"
          text="Home"
          icon={<BiHome />}
        />
        <SidebarNavigationButton
          destination="/explore"
          text="Explore"
          icon={<BiSearch />}
        />
        <SidebarNavigationButton
          destination="/notifications"
          text="Notifications"
          icon={<BiBell />}
        />
        <SidebarNavigationButton
          destination="/profile"
          text="Profile"
          icon={<BiUser />}
        />
        <SidebarNavigationButton
          destination="/settings"
          text="Settings"
          icon={<BiSolidCog />}
        />

        <div className="mt-auto mb-6 lg:mb-12">
          <ProfileCard
            username="warko"
            handleName="Randy Orton"
            pfpUrl="https://e1.pxfuel.com/desktop-wallpaper/708/299/desktop-wallpaper-wwe-randy-orton-weneedfun-randy-orton-2019-thumbnail.jpg"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
