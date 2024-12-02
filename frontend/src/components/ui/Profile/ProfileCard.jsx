const ProfileCard = ({ user }) => {
  return (
    <div className="flex relative p-4 border-b border-gray-600 hover:bg-gray-900 hover:cursor-pointer">
      <img
        className="w-12 h-12 rounded-full object-cover"
        src={user.avatarUrl}
        alt={`${user.displayName}'s profile`}
      />
      <div className="w-full ml-3">
        <h1>{user.displayName}</h1>
        <h2 className="mb-1 text-gray-400">@{user.username}</h2>
        <p>{user.bio}</p>
      </div>
      <button className="absolute top-4 right-4 px-4 py-2 bg-white hover:bg-gray-200 text-gray-800 font-bold rounded-full">
        Follow
      </button>
    </div>
  );
};

export default ProfileCard;
