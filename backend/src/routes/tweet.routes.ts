import express from "express";
import { protect } from "../middleware/protect";
import {
  getAllTweets,
  getUserTweets,
  postTweet,
  test,
} from "../controllers/tweet.controller";

const router = express.Router();

router.get("/test", test);
router.post("/", protect, postTweet);
router.get("/all", protect, getAllTweets);
router.get("/user/:userId", protect, getUserTweets);

export default router;
