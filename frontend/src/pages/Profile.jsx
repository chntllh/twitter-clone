import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ui/Profile/ProfileHeader.jsx";
import { useEffect, useState } from "react";
import Post from "../components/ui/Post/Post.jsx";
import LabelledSelectorTabs from "../components/ui/LabelledSelectorTabs.jsx";
import { getUser, getUserTweets } from "../api/api.js";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user) || {};
  const { username } = useParams();

  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("tweets");
  const [posts, setPosts] = useState([]);

  const tabs = [
    {
      tab: "tweets",
      tabName: "Tweets",
    },
    {
      tab: "replies",
      tabName: "Replies",
    },
    {
      tab: "media",
      tabName: "Media",
    },
    {
      tab: "likes",
      tabName: "Likes",
    },
  ];

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    const fetchUserPosts = (userId) => {
      getUserTweets(userId)
        .then((res) => {
          setPosts(res.data);
        })
        .catch((error) => {
          console.error("Error fetching posts: ", error);
        });
    };

    const fetchUser = () => {
      getUser(username)
        .then((res) => {
          setUser(res.data);
          fetchUserPosts(res.data.userId);
        })
        .catch((error) => {
          if (error.response && error.response.data.statusCode === 404) {
            setUser(null);
          } else {
            console.error(error);
          }
        });
    };

    fetchUser();
  }, [username]);

  return (
    <div>
      <ProfileHeader user={user} isOwner={isOwner} />

      {user !== null && (
        <div>
          <LabelledSelectorTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div>
            {activeTab === "tweets" &&
              posts.map((post) => <Post post={post} key={post.tweetId} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
