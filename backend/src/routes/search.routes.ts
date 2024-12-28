import { Router } from "express";
import {
  getAllHashtags,
  getHashtagTweets,
} from "../controllers/search.controller";
import { protect } from "../middleware/protect";
import { getMentionNotification } from "../controllers/notification.controller";

const router = Router();

router.get("/all", protect, getAllHashtags);
router.get("/hashtagtweets/:hashtag", protect, getHashtagTweets);
router.get("/notifications/mentions", protect, getMentionNotification);

export default router;
