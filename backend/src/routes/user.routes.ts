import { Router } from "express";
import { protect } from "../middleware/protect";
import { getUser, updateUser } from "../controllers/user.controller";
import {
  follow,
  followers,
  following,
  isFollowing,
  unfollow,
} from "../controllers/follow.controller";
import {
  getUserFollowingTweets,
  getUserTweets,
} from "../controllers/tweet.controller";
import { getNotification } from "../controllers/notification.controller";

const router = Router();

router.get("/:identifier", protect, getUser);
router.get("/:identifier/followers", protect, followers);
router.get("/:identifier/following", protect, following);
router.get("/:identifier/is-following", protect, isFollowing);
router.get("/:identifier/usertweets", protect, getUserTweets);
router.get("/:identifier/followingtweets", protect, getUserFollowingTweets);
router.post("/:identifier/follow", protect, follow);
router.post("/:identifier/unfollow", protect, unfollow);
router.post("/update", protect, updateUser);
router.get("/:identifier/notifications", protect, getNotification);

export default router;
