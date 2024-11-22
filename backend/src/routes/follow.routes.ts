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
router.get("/followers/:userId", protect, followers);
router.get("/following/:userId", protect, following);
router.get("/is-following/:userId", protect, isFollowing);

export default router;
