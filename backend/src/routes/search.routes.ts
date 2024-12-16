import { Router } from "express";
import {
  getAllHashtags,
  getHashtagTweets,
  test,
} from "../controllers/search.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/test", test);
router.get("/all", protect, getAllHashtags);
router.get("/hashtagtweets/:hashtag", protect, getHashtagTweets);

export default router;
