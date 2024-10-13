import ForYouFollowing from "../components/ForYouFollowing.jsx";
import Posts from "../components/Posts.jsx";
import TweetBox from "../components/TweetBox.jsx";

export default function Home() {
  return (
    <div className=''>
      <ForYouFollowing active='for-you' />
      <TweetBox />
      <Posts />
    </div>
  );
}