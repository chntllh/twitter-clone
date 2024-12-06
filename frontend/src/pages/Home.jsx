import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TweetBox from "../components/ui/Home/TweetBox.jsx";
import Posts from "../components/ui/Post/Posts.jsx";
import LabelledSelectorTabs from "../components/ui/LabelledSelectorTabs.jsx";
import { getAllTweets, getUserFollowingTweets } from "../api/api.js";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [forYouPosts, setForYouPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);

  const [activeTab, setActiveTab] = useState("for-you");

  const tabs = [
    {
      tab: "for-you",
      tabName: "For You",
    },
    {
      tab: "following",
      tabName: "Following",
    },
  ];

  useEffect(() => {
    if (!currentUser?.userId) return;

    const fetchForYouPosts = async () => {
      getAllTweets()
        .then((res) => {
          setForYouPosts(res.data);
        })
        .catch((error) => {
          console.error("Error fetching posts: ", error);
        });
    };

    const fetchFollowingPosts = async () => {
      getUserFollowingTweets(currentUser.userId)
        .then((res) => {
          setFollowingPosts(res.data);
        })
        .catch((error) => {
          console.error("Error fetching posts: ", error);
        });
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

  return (
    <div className="">
      <div className="sticky top-0 z-10 backdrop-blur-lg">
        <LabelledSelectorTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
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
