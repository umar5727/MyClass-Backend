import { Router } from "express";
import { signOut, login, signUp, refreshAccessToken, updateUserAvatar, updateAccountDetails, changeCurrentPassword, forgotPassword } from "../controllers/user.controller.js";
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

router.route('/login').post(login).get()

//secure route
router.route('/signOut').post(verifyJWT, signOut)
router.route('/refreshAccessToken').post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, Upload.single("avatar"), updateUserAvatar)
router.route('/forgotPassword', forgotPassword)
export default router