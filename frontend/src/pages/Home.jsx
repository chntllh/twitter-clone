import ForYouFollowing from "../components/ui/Home/ForYouFollowing.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import TweetBox from "../components/ui/Home/TweetBox.jsx";
import Posts from "../components/ui/Post/Posts.jsx";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [forYouPosts, setForYouPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);

  const [activeTab, setActiveTab] = useState("for-you");

  useEffect(() => {
    if (!currentUser?.userId) return;

    const fetchForYouPosts = async () => {
      try {
        const response = await axios.get("/api/tweet/all");
        setForYouPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    const fetchFollowingPosts = async () => {
      try {
        const response = await axios.get(
          `/api/tweet/following/${currentUser.userId}`
        );
        setFollowingPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    if (activeTab === "for-you") {
      fetchForYouPosts();
    } else if (activeTab === "following") {
      fetchFollowingPosts();
    }
  }, [currentUser?.userId, activeTab]);

  const postTweet = (post) => {
    setForYouPosts((rest) => [post, ...rest]);
  };

  console.log(forYouPosts, followingPosts);

  return (
    <div className="">
      <div className="sticky top-0 z-10">
        <ForYouFollowing activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <TweetBox
        profilePictureUrl={currentUser.avatarUrl}
        onPost={(post) => postTweet(post)}
      />
      {activeTab === "for-you" && <Posts posts={forYouPosts} />}
      {activeTab === "following" && <Posts posts={followingPosts} />}
    </div>
  );
};

export default Home;
