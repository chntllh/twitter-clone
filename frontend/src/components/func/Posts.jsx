import Post from "../ui/Post.jsx";

const Posts = () => {
  const samplePost = {
    profilePictureUrl:
      "https://e1.pxfuel.com/desktop-wallpaper/708/299/desktop-wallpaper-wwe-randy-orton-weneedfun-randy-orton-2019-thumbnail.jpg",
    username: "Randy Orton",
    handle: "CivilwaRKO",
    postDate: "Oct 28",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, cupiditate illo temporibus inventore nulla ratione maxime placeat ipsam quos laboriosam repellat dignissimos, ullam eius architecto, voluptate quam. Maiores, assumenda mollitia!",
    imageUrl:
      "https://wallpapers.com/images/featured/dragon-ball-super-pictures-6s9gnffpcvuar9c4.jpg",
    stats: {
      comments: 10,
      retweets: 15,
      likes: 50,
      shares: 5,
    },
  };

  return (
    <div>
      <Post postUser={samplePost} />
      <Post postUser={samplePost} />
      <Post postUser={samplePost} />
      <Post postUser={samplePost} />
    </div>
  );
};

export default Posts;
