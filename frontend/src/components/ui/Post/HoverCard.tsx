import { useEffect, useState } from "react";
import { follow, getUserAndIsFollowing, unfollow } from "../../../api/api";

const HoverCard = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Partial<AppUser>>({
    avatarUrl: "",
    displayName: "Name",
    username: "username",
    bio: "",
    followingCount: 0,
    followersCount: 0,
  });
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = () => {
      getUserAndIsFollowing(userId)
        .then((res) => {
          console.log(res)
          setUser(res.user as Partial<AppUser>);
          setIsFollowing(res.isFollowing as boolean)
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchUser();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      isFollowing ? unfollow(userId) : follow(userId);
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="p-4 z-10 left-28 md:left-0 w-72 relative bg-black border border-gray-600 rounded-lg"
      style={{
        boxShadow: "0px 0px 10px rgba(100, 100, 100, 1)",
      }}
    >
      {loading ? (
        <div className="mx-auto animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white" />
      ) : (
        <div>
          <img
            className="w-16 h-16 mb-2 rounded-full object-cover"
            src={user.avatarUrl}
            alt={`${user.displayName}'s profile`}
          />
          <button
            className="absolute top-4 right-4 px-4 py-2 bg-white hover:bg-gray-200 text-gray-800 font-bold rounded-full"
            onClick={handleFollowToggle}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <div className="flex-col mb-2">
            <h1 className="font-bold">{user.displayName}</h1>
            <h2 className="text-gray-400">@{user.username}</h2>
          </div>
          <p className="mb-3">{user.bio}</p>
          <div className="flex gap-4">
            <div className="gap-2 flex">
              <div className="font-bold">{user.followingCount}</div>
              <div className="text-gray-400">Following</div>
            </div>
            <div className="gap-2 flex">
              <div className="font-bold">{user.followersCount}</div>
              <div className="text-gray-400">Followers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverCard;
