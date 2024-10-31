import ForYouFollowing from "../components/ui/ForYouFollowing.jsx";
import Posts from "../components/func/Posts.jsx";
import TweetBox from "../components/ui/TweetBox.jsx";

const Home = () => {
  return (
    <div className="">
      <ForYouFollowing active="for-you" />

      <TweetBox
        profilePictureUrl="https://e1.pxfuel.com/desktop-wallpaper/708/299/desktop-wallpaper-wwe-randy-orton-weneedfun-randy-orton-2019-thumbnail.jpg"
        onPost={(text) => console.log("New Comment:", text)}
      />

      <Posts />
    </div>
  );
};

export default Home;
