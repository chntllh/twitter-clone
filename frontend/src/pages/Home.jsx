import ForYouFollowing from "../components/ui/ForYouFollowing.jsx";
import TweetBox from "../components/ui/TweetBox.jsx";
import { useSelector } from "react-redux";
import Post from "../components/ui/Post.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

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

  console.log(posts);

  return (
    <div className="">
      <ForYouFollowing active="for-you" />

      <TweetBox
        profilePictureUrl={currentUser.avatarUrl}
        onPost={(text) => console.log("New Comment:", text)}
      />

      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </div>
  );
};

export default Home;
