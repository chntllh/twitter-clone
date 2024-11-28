import SidebarNavigationButton from "../components/ui/SidebarNavigationButton.jsx";
import { BiBell, BiHome, BiSearch, BiSolidCog, BiUser } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { signOut } from "../store/reducer/user.reducer.js";

const Sidebar = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [showDialog, setShowDialog] = useState(false);
  
  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    setShowDialog(false);
    dispatch(signOut());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowDialog(false);
      }
    };

    if (showDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDialog]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="sticky top-0 hidden sm:block h-screen">
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
          destination={`/${currentUser.username}`}
          text="Profile"
          icon={<BiUser />}
        />
        <SidebarNavigationButton
          destination="/settings"
          text="Settings"
          icon={<BiSolidCog />}
        />

        <div className="mt-auto mb-6 lg:mb-12">
          <div className="relative inline-block">
            <div
              ref={profileRef}
              onClick={() => setShowDialog((prev) => !prev)}
              className="gap-3 lg:ml-3 flex flex-row justify-start items-center cursor-pointer hover:bg-neutral-900 hover:rounded-full"
            >
              <img
                className="w-10 lg:w-12 h-10 lg:h-12 rounded-full object-cover"
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
              />
              <div className="hidden lg:block">
                <h1>{currentUser.displayName}</h1>
                <p>@{currentUser.username}</p>
              </div>
            </div>

            {showDialog && (
              <div
                ref={dialogRef}
                className="absolute bottom-full left-0 mb-2 w-52 bg-black border border-gray-600 rounded-lg z-10"
                style={{
                  boxShadow: "0px 0px 6px rgba(75, 85, 99, 1)",
                }}
              >
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 hover:bg-gray-900"
                  >
                    <span className="font-bold text-white">
                      Logout @{currentUser.username}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
