import express from "express";
import {
  follow,
  followers,
  following,
  test,
  unfollow,
} from "../controllers/follow.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router.get("/test", test);
router.post("/follow/:userId", protect, follow);
router.post("/unfollow/:userId", protect, unfollow);
router.get("/followers/:userId", protect, followers);
router.get("/following/:userId", protect, following);

export default router;
