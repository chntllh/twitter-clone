import { Router } from "express";
import {
  likeTweet,
  retweetTweet,
  test,
  unlikeTweet,
  unretweetTweet,
} from "../controllers/tweetActions.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/test", test);
router.post("/like/:tweetId", protect, likeTweet);
router.post("/unlike/:tweetId", protect, unlikeTweet);
router.post("/retweet/:tweetId", protect, retweetTweet);
router.post("/unretweet/:tweetId", protect, unretweetTweet);

export default router;
