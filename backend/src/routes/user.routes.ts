import { Router } from "express";
import { protect } from "../middleware/protect";
import { getUser, updateUser } from "../controllers/user.controller";
import {
  follow,
  followers,
  following,
  isFollowing,
  unfollow,
} from "../controllers/follow.controller";

const router = Router();

router.get("/:identifier", protect, getUser);
router.get("/:identifier/followers", protect, followers);
router.get("/:identifier/following", protect, following);
router.get("/:identifier/is-following", protect, isFollowing);
router.post("/:identifier/follow", protect, follow);
router.post("/:identifier/unfollow", protect, unfollow);
router.post("/update", protect, updateUser);

export default router;
