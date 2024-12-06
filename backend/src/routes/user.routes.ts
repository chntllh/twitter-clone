import { Router } from "express";
import { protect } from "../middleware/protect";
import { getUser, test, updateUser } from "../controllers/user.controller";
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

const router = Router();

router.get("/test", test);
router.get("/:identifier", protect, getUser);
router.get("/:identifier/followers", protect, followers);
router.get("/:identifier/following", protect, following);
router.get("/:identifier/is-following", protect, isFollowing);
router.get("/:identifier/usertweets", protect, getUserTweets);
router.get("/:identifier/followingtweets", protect, getUserFollowingTweets);
router.post("/:identifier/follow", protect, follow);
router.post("/:identifier/unfollow", protect, unfollow);
router.post("/update", protect, updateUser);

export default router;
