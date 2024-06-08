import { Router } from "express";
import { logOut, login, signUp } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/register').post(
    Upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ])
    , signUp
)

//router.route('/login').post(login)

//secure route
router.route('/logout').post(verifyJWT, logOut)

export default router