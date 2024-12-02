import { Router } from "express";
import {
  follow,
  followers,
  following,
  isFollowing,
  test,
  unfollow,
} from "../controllers/follow.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/test", test);
router.post("/follow/:userId", protect, follow);
router.post("/unfollow/:userId", protect, unfollow);
router.get("/:identifier/followers", protect, followers);
router.get("/:identifier/following", protect, following);
router.get("/:identifier/is-following", protect, isFollowing);

export default router;
