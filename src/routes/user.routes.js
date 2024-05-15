import { Router } from "express";
import { logOut, login, signUp } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/signUp').post(signUp)

router.route('/login').post(login)

//secure route
router.route('/logout').post(verifyJWT, logOut)
export default router