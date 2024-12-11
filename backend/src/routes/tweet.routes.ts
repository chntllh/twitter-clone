import { Router } from "express";
import { protect } from "../middleware/protect";
import { getAllTweets, postTweet, test } from "../controllers/tweet.controller";
import {
  likeTweet,
  retweetTweet,
  unlikeTweet,
  unretweetTweet,
} from "../controllers/tweetActions.controller";

const router = Router();

router.get("/test", test);
router.post("/", protect, postTweet);
router.get("/all", protect, getAllTweets);
router.post("/:tweetId/like", protect, likeTweet);
router.post("/:tweetId/unlike", protect, unlikeTweet);
router.post("/:tweetId/retweet", protect, retweetTweet);
router.post("/:tweetId/unretweet", protect, unretweetTweet);

export default router;
