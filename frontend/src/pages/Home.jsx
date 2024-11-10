import ForYouFollowing from "../components/ui/ForYouFollowing.jsx";
import Posts from "../components/func/Posts.jsx";
import TweetBox from "../components/ui/TweetBox.jsx";
import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="">
      <ForYouFollowing active="for-you" />

      <TweetBox
        profilePictureUrl={currentUser.avatarUrl}
        onPost={(text) => console.log("New Comment:", text)}
      />

      <Posts />
    </div>
  );
};

export default Home;
