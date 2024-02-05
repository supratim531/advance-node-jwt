import { Router } from "express";
import { checkRoles } from "../middlewares/roleHandler.js";
import { validateToken } from "../middlewares/validateTokenHandler.js";
import {
  test,
  login,
  register,
  getCurrentUser,
  getNewAccessToken
} from "../controllers/authController.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/token").post(getNewAccessToken);
router.route("/current").get(validateToken, getCurrentUser);
router.route("/test").get(validateToken, checkRoles(["admin"]), test);

export default router;
