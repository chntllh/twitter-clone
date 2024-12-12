import { NavLink } from "react-router-dom";

const SidebarNavigationButton = ({ destination, text, icon }) => {
  return (
    <NavLink
      to={destination}
      className={({ isActive }) => (isActive ? "text-blue-500" : "")}
    >
      <div className="flex items-center text-center justify-start gap-5 p-2 w-fit hover:bg-neutral-900 hover:rounded-full hover:cursor-pointer">
        <div className="text-2xl ml-1">{icon}</div>
        <span className="hidden text-2xl xl:block">{text}</span>
      </div>
    </NavLink>
  );
};

export default SidebarNavigationButton;
