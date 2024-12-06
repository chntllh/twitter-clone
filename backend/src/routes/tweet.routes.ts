import { Router } from "express";
import { protect } from "../middleware/protect";
import { getAllTweets, postTweet, test } from "../controllers/tweet.controller";

const router = Router();

router.get("/test", test);
router.post("/", protect, postTweet);
router.get("/all", protect, getAllTweets);

export default router;
