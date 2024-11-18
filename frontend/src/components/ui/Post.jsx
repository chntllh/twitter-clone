import {
  HiArrowPathRoundedSquare,
  HiEllipsisHorizontal,
  HiMiniArrowUpTray,
  HiOutlineBars3CenterLeft,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHeart,
} from "react-icons/hi2";
import { getRelativeTime } from "../../utils/relativeTime.js";

const Post = ({ post }) => {
  const {
    avatarUrl,
    displayName,
    username,
    createdAt,
    content,
    imageUrl,
    commentsCount = 0,
    retweetCount = 0,
    likesCount = 0,
    sharesCount = 0,
  } = post;

  return (
    <div className="flex p-4 border-b border-gray-600">
      {/* Profile Picture */}
      <div className="w-14 cursor-pointer">
        <img
          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-md"
          src={avatarUrl}
          alt={`${displayName}'s profile`}
        />
      </div>

      {/* Post Content */}
      <div className="w-full px-2">
        {/* Header: displayName, username, and Options */}
        <div className="flex justify-between">
          <div className="flex gap-1">
            <h1 className="font-medium hover:underline cursor-pointer">
              {displayName}
            </h1>
            <h1 className="font-light text-gray-300">
              @{username} · {getRelativeTime(createdAt)}
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

        {/* Post Actions: commentsCount, retweetCount, likesCount, etc. */}
        <div className="w-full flex pt-3 justify-between items-center text-xl text-gray-400">
          <div className="flex items-center gap-1">
            <HiOutlineChatBubbleOvalLeft />
            <div className="text-sm">{commentsCount}</div>
          </div>
          <div className="flex items-center gap-1">
            <HiArrowPathRoundedSquare />
            <div className="text-sm">{retweetCount}</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineHeart />
            <div className="text-sm">{likesCount}</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineBars3CenterLeft />
            <div className="text-sm">{sharesCount}</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineBookmark />
            <HiMiniArrowUpTray />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
