import express from "express";
import { login, register, test } from "../controllers/auth.controller";

const router = express.Router();

router.get("/test", test)
router.post("/register", register);
router.post("/login", login)

export default router;
