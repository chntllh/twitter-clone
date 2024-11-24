import { Router } from "express";
import { getUser, test, updateUser } from "../controllers/user.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/test", test);
router.get("/:identifier", protect, getUser);
router.post("/update/", protect, updateUser);

export default router;
