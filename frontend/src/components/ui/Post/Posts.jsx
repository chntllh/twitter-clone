import Post from "./Post.jsx";

const Posts = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <Post post={post} key={post.tweetId} />
      ))}
    </div>
  );
};

export default Posts;
