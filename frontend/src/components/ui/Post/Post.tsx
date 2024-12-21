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
import { PiDotBold } from "react-icons/pi";
import { useCallback, useEffect, useRef, useState } from "react";
import HoverCard from "./HoverCard";
import {
  likeTweet,
  retweetTweet,
  unlikeTweet,
  unretweetTweet,
} from "../../../api/api";
import { getRelativeTime } from "../../../utils/relativeTime";
import { FormatContentWithHashtags } from "../../func/FormatContentWithHashtags";
import { useNavigate } from "react-router-dom";

type Timeout = ReturnType<typeof setTimeout>;

type ExtendedTweet = Tweet & {
  tweet: Tweet["tweet"] & {
    commentsCount?: number;
    sharesCount?: number;
  }
}

const Post = ({ post }: { post: ExtendedTweet }) => {
  const navigate = useNavigate();

  const {
    user: { userId, avatarUrl, displayName, username },
    tweet: {
      tweetId,
      content,
      imageUrl,
      createdAt,
      likesCount: initialLikesCount = 0,
      retweetCount: initialRetweetsCount = 0,
      commentsCount = 0,
      sharesCount = 0,
    },
    retweeter,
    liked: initialLiked = false,
    retweeted: initialRetweeted = false,
  } = post;

  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialLiked);
  const [retweetCount, setRetweetCount] = useState(initialRetweetsCount);
  const [retweeted, setRetweeted] = useState(initialRetweeted);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleTimeoutRef = useRef<Timeout | null>(null);
  const hoverTimeoutRef = useRef<Timeout | null>(null);

  const handleMouseEnter = () => {
    if (visibleTimeoutRef.current) clearTimeout(visibleTimeoutRef.current);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
    setIsVisible(true);
  };

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300) as unknown as Timeout;
    visibleTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 500) as unknown as Timeout;
  }, []);

  useEffect(() => {
    return () => {
      if (visibleTimeoutRef.current) clearTimeout(visibleTimeoutRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleOpenProfile = () => {
    console.log(retweeter);
    navigate(`/${retweeter ? retweeter.username : username}`);
  };

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

  const toggleRetweet = () => {
    if (retweeted) {
      unretweetTweet(tweetId)
        .then(() => {
          setRetweetCount((prev) => prev - 1);
          setRetweeted(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      retweetTweet(tweetId)
        .then(() => {
          setRetweetCount((prev) => prev + 1);
          setRetweeted(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="flex p-4 gap-2 border-b max-w-full border-gray-600 hover:cursor-pointer hover:bg-gray-900">
      <div
        className="relative w-16 h-16 cursor-pointer flex-shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Profile Picture */}
        <img
          className="left-0 top-0 w-14 h-14 object-cover rounded-full"
          src={`${retweeter ? retweeter.avatarUrl : avatarUrl}`}
          loading="lazy"
          alt={`${retweeter ? retweeter.displayName : displayName}'s profile`}
          onClick={handleOpenProfile}
        />

        {/* Hover Card */}
        {isVisible && (
          <div
            className={`absolute top-12 left-1/2 transform -translate-x-1/2 z-10 transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"
              }`}
          >
            <HoverCard userId={retweeter ? retweeter.userId : userId} />
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden">
        {/* Header: displayName, username, and Options */}
        <div className="flex justify-between mb-1">
          <div className="flex items-center">
            <div className="flex gap-1" onClick={handleOpenProfile}>
              <p className="font-medium hover:underline">
                {retweeter ? retweeter.displayName : displayName}
              </p>
              <p className="font-light">
                @{retweeter ? retweeter.username : username}
              </p>
            </div>
            <PiDotBold />
            <p className="font-light">
              {getRelativeTime(retweeter ? retweeter.retweetedAt : createdAt)}
            </p>
          </div>
          <HiEllipsisHorizontal className="text-2xl cursor-pointer" />
        </div>

        {/* Post Text */}
        <div
          className={`whitespace-pre-wrap break-words ${retweeter && "border border-gray-600 rounded-lg mt-3 p-4 hover:bg-gray-800"
            }`}
        >
          {retweeter && (
            <div className="flex gap-1 items-center mb-2">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 object-cover rounded-full mr-1"
              />
              <p className="font-medium">{displayName}</p>
              <p className="font-light">{username}</p>
              <PiDotBold />
              <p className="font-light">{getRelativeTime(createdAt)}</p>
            </div>
          )}
          <div className={`${isExpanded ? "" : "line-clamp-4"}`}>
            {FormatContentWithHashtags(content)}
          </div>
          {content.split("\n").length > 4 && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="text-blue-500 hover:underline mt-2"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
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

          <div
            className={`flex items-center gap-1 hover:cursor-pointer ${retweeted && "text-green-400"
              }`}
            onClick={toggleRetweet}
          >
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
