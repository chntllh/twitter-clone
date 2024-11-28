import { BiCalendarAlt } from "react-icons/bi";
import { useParams } from "react-router-dom";
import EditProfileModal from "./EditProfileModal.jsx";
import { useState } from "react";

const ProfileHeader = ({ user, isOwner }) => {
  const { username } = useParams(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (user === null) {
    return (
      <div className="relative">
        <div className="h-48 bg-neutral-700"></div>

        <div className="absolute top-32 left-4 w-32 h-32 rounded-full border-4 border-black overflow-hidden">
          <div className="bg-white w-32 h-32"></div>
        </div>

        <div className="mt-20 ml-4">
          <h1 className="text-2xl font-bold">@{username}</h1>

          <div className="w-96 mx-auto">
            <h1 className="mt-16 text-4xl font-bold">
              This account doesn’t exist
            </h1>
            <p className="mt-4">Try searching for another.</p>
          </div>
        </div>
      </div>
    );
  }

  const createdAtDate = new Date(user.createdAt);
  const options = { year: "numeric", month: "long" };
  const formattedDate = createdAtDate.toLocaleDateString("en-US", options);

  return (
    <div>
      <div className="relative">
        <div className="h-48 bg-neutral-700"></div>

        <div className="absolute top-32 left-4 w-32 h-32 rounded-full border-4 border-black overflow-hidden">
          <img src={user.avatarUrl} alt="Avatar" className="h-32 w-32 object-cover" />
        </div>

        {isOwner && (
          <button
            className="absolute right-4 top-52 px-4 py-2 hover:bg-neutral-800 border border-neutral-600 font-bold rounded-full"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit profile
          </button>
        )}

        <div className="mt-20 ml-4">
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <h2 className="text-gray-500 mb-2">@{user.username}</h2>

          <p>{user.bio}</p>

          <h3 className="mt-3 flex items-center gap-1.5 text-gray-500">
            <BiCalendarAlt />
            {"Joined " + formattedDate}
          </h3>

          <div className="mt-3 flex gap-4">
            <div className=" flex gap-1.5">
              <strong>{user.followingCount}</strong>
              <p className="text-gray-500">Following</p>
            </div>
            <div className="flex gap-1.5">
              <strong>{user.followersCount}</strong>
              <p className="text-gray-500">Followers</p>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default ProfileHeader;
