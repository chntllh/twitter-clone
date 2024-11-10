import { useSelector } from "react-redux";

const ProfileCard = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="gap-3 lg:ml-3 flex flex-row justify-start items-center cursor-pointer hover:bg-neutral-900 hover:rounded-full">
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
  );
};

export default ProfileCard;
