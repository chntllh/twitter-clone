import { Router } from "express";
import {
  google,
  login,
  preLogin,
  preRegister,
  register,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", google);
router.post("/prelogin", preLogin);
router.post("/preregister", preRegister);

export default router;
