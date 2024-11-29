import { Router } from "express";
import { protect } from "../middleware/protect";
import {
  getAllTweets,
  getUserFollowingTweets,
  getUserTweets,
  postTweet,
  test,
} from "../controllers/tweet.controller";

const router = Router();

router.get("/test", test);
router.post("/", protect, postTweet);
router.get("/all", protect, getAllTweets);
router.get("/user/:userId", protect, getUserTweets);
router.get("/following/:userId", protect, getUserFollowingTweets)

export default router;
