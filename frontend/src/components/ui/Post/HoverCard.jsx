import { useEffect, useState } from "react";
import axios from "axios";

const HoverCard = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    avatarUrl: "",
    displayName: "Name",
    username: "username",
    bio: "",
    followingCount: 0,
    followersCount: 0,
  });
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [userResponse, followResponse] = await axios.all([
          axios.get(`/api/user/${userId}`),
          axios.get(`/api/follow/${userId}/is-following`),
        ]);
        setUser(userResponse.data);
        setIsFollowing(followResponse.data.isFollowing);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      const endpoint = isFollowing
        ? `/api/follow/unfollow/${userId}`
        : `/api/follow/follow/${userId}`;
      await axios.post(endpoint);
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
