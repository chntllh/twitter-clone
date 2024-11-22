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
import { useEffect, useRef, useState } from "react";
import HoverCard from "./HoverCard.jsx";

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
    userId,
  } = post;

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

  return (
    <div className="flex p-4 border-b border-gray-600 relative">
      <div
        className="relative w-14 h-14 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Profile Picture */}
        <img
          className="object-cover rounded-full"
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
              className="max-h-[600px] max-w-full object-cover mx-auto border-2 border-gray-300 rounded-2xl"
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
