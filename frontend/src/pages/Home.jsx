import ForYouFollowing from "../components/ui/Home/ForYouFollowing.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/ui/Post/Post.jsx";
import TweetBox from "../components/ui/Home/TweetBox.jsx";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/tweet/all");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  const postTweet = (post) => {
    setPosts((rest) => [post, ...rest]);
  };

  return (
    <div className="">
      <ForYouFollowing active="for-you" />

      <TweetBox
        profilePictureUrl={currentUser.avatarUrl}
        onPost={(post) => postTweet(post)}
      />

      {posts.map((post) => (
        <Post post={post} key={post.tweetId} />
      ))}
    </div>
  );
};

export default Home;
