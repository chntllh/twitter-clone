import { Router } from "express";
import {
  getAllHashtags,
  getHashtagTweets,
} from "../controllers/search.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/all", protect, getAllHashtags);
router.get("/hashtagtweets/:hashtag", protect, getHashtagTweets);

export default router;
