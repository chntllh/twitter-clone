import Post from "./Post.jsx";

const Posts = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <Post
          post={post}
          key={post.retweeter ? post.retweeter.retweetId : post.tweet.tweetId}
        />
      ))}
    </div>
  );
};

export default Posts;
