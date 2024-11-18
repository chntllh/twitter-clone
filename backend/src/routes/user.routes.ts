import { Router } from "express";
import { getUser, test } from "../controllers/user.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/test", test);
router.get("/:userId", protect, getUser);

export default router;
