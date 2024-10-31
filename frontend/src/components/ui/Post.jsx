import {
  HiArrowPathRoundedSquare,
  HiEllipsisHorizontal,
  HiMiniArrowUpTray,
  HiOutlineBars3CenterLeft,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHeart,
} from "react-icons/hi2";

const Post = ({ postUser }) => {
  const {
    profilePictureUrl,
    username,
    handle,
    postDate,
    content,
    imageUrl,
    stats: { comments, retweets, likes, shares },
  } = postUser;

  return (
    <div className="flex p-4 border-b border-gray-600">
      {/* Profile Picture */}
      <div className="w-14 cursor-pointer">
        <img
          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-md"
          src={profilePictureUrl}
          alt={`${username}'s profile`}
        />
      </div>

      {/* Post Content */}
      <div className="w-full px-2">
        {/* Header: Username, Handle, and Options */}
        <div className="flex justify-between">
          <div className="flex gap-1">
            <h1 className="font-medium hover:underline cursor-pointer">
              {username}
            </h1>
            <h1 className="font-light text-gray-300">
              @{handle} · {postDate}
            </h1>
          </div>
          <HiEllipsisHorizontal className="text-2xl cursor-pointer" />
        </div>

        {/* Post Text */}
        <div className="py-2">
          <p>{content}</p>
        </div>

        {/* Post Image (if available) */}
        {imageUrl && (
          <div className="cursor-pointer">
            <img
              className="max-h-[300px] max-w-full object-cover mx-auto border-2 border-gray-300 rounded-2xl"
              src={imageUrl}
              alt="Post"
            />
          </div>
        )}

        {/* Post Actions: Comments, Retweets, Likes, etc. */}
        <div className="w-full flex pt-3 justify-between items-center text-xl text-gray-400">
          <div className="flex items-center gap-1">
            <HiOutlineChatBubbleOvalLeft />
            <div className="text-sm">{comments}</div>
          </div>
          <div className="flex items-center gap-1">
            <HiArrowPathRoundedSquare />
            <div className="text-sm">{retweets}</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineHeart />
            <div className="text-sm">{likes}</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineBars3CenterLeft />
            <div className="text-sm">{shares}</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineBookmark />
            <HiMiniArrowUpTray />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
