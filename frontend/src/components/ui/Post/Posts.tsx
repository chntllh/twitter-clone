import Post from "./Post";

const Posts = ({ posts }: { posts: Tweet[] }) => {
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
