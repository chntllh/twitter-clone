import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ui/Profile/ProfileHeader.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileTabs from "../components/ui/Profile/ProfileTabs.jsx";
import Post from "../components/ui/Post/Post.jsx";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user) || {};
  const { username } = useParams();

  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("Tweets");
  const [posts, setPosts] = useState([]);

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    const fetchUserPosts = async (userId) => {
      try {
        const response = await axios.get(`/api/tweet/user/${userId}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/${username}`);
        setUser(response.data);
        fetchUserPosts(response.data.userId);
      } catch (error) {
        if (error.response && error.response.data.statusCode === 404) {
          setUser(null);
        } else {
          console.error(error);
        }
      }
    };

    fetchUser();
  }, [username]);

  return (
    <div>
      <ProfileHeader user={user} isOwner={isOwner} />

      {user !== null && (
        <div>
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div>
            {activeTab === "Tweets" &&
              posts.map((post) => <Post post={post} key={post.tweetId} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
