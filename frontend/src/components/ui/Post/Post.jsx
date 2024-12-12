import {
  HiArrowPathRoundedSquare,
  HiEllipsisHorizontal,
  HiHeart,
  HiMiniArrowUpTray,
  HiOutlineBars3CenterLeft,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHeart,
} from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";
import HoverCard from "./HoverCard.jsx";
import { likeTweet, unlikeTweet } from "../../../api/api.js";
import { getRelativeTime } from "../../../utils/relativeTime.js";
import { FormatContentWithHashtags } from "../../func/FormatContentWithHashtags.jsx";

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
    likesCount: initialLikesCount = 0,
    sharesCount = 0,
    userId,
    tweetId,
    liked: initialLiked = false,
  } = post;

  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialLiked);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const visibleTimeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (visibleTimeoutRef.current) clearTimeout(visibleTimeoutRef.current);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500);
    visibleTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (visibleTimeoutRef.current) clearTimeout(visibleTimeoutRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const toggleLike = () => {
    if (liked) {
      unlikeTweet(tweetId)
        .then(() => {
          setLikesCount((prev) => prev - 1);
          setLiked(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      likeTweet(tweetId)
        .then(() => {
          setLikesCount((prev) => prev + 1);
          setLiked(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="flex p-4 gap-2 border-b max-w-full border-gray-600">
      <div
        className="relative w-16 h-16 cursor-pointer flex-shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Profile Picture */}
        <img
          className="left-0 top-0 w-14 h-14 object-cover rounded-full"
          src={avatarUrl}
          alt={`${displayName}'s profile`}
        />

        {/* Hover Card */}
        {isVisible && (
          <div
            className={`absolute top-12 left-1/2 transform -translate-x-1/2 z-10 transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <HoverCard userId={userId} />
          </div>
        )}
      </div>

      <div className="w-full overflow-auto">
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
        <div className="py-2 whitespace-pre-wrap break-words">
          {FormatContentWithHashtags(content)}
        </div>

        {/* Post Image (if available) */}
        {imageUrl && (
          <div className="cursor-pointer">
            <img
              className="max-h-[600px] max-w-full object-cover mx-auto border-2 border-gray-300 rounded-2xl"
              src={imageUrl}
            />
          </div>
        )}

        {/* Post Actions: commentsCount, retweetCount, likesCount, etc. */}
        <div className="w-full flex pt-3 justify-between items-center text-xl text-gray-400">
          <div className="flex items-center gap-1 hover:cursor-pointer">
            <HiOutlineChatBubbleOvalLeft />
            <div className="text-sm">{commentsCount}</div>
          </div>
          <div className="flex items-center gap-1 hover:cursor-pointer">
            <HiArrowPathRoundedSquare />
            <div className="text-sm">{retweetCount}</div>
          </div>
          <div
            className="flex items-center gap-1 hover:cursor-pointer"
            onClick={toggleLike}
          >
            {liked ? (
              <div className="text-red-400">
                <HiHeart />
              </div>
            ) : (
              <HiOutlineHeart />
            )}
            <div className="text-sm">{likesCount}</div>
          </div>
          <div className="flex items-center gap-1 hover:cursor-pointer">
            <HiOutlineBars3CenterLeft />
            <div className="text-sm">{sharesCount}</div>
          </div>
          <div className="flex items-center gap-1 hover:cursor-pointer">
            <HiOutlineBookmark />
            <HiMiniArrowUpTray />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
