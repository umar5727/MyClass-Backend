/**
 * @swagger
 * /api/v1/users/getAllUsers:
 *   get:
 *     summary: Get all users
 *     description: Fetch all user data
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       400:
 *         description: Unable to fetch user details
 */
// getAllUser swagger ends 

import { Router } from "express";
import { signOut, login, signUp, refreshAccessToken, updateUserAvatar, updateAccountDetails, changeCurrentPassword, forgotPassword, userProfile, instructorProfile, getAllUsers } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.route('/getAllUsers').get(getAllUsers)

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

router.route('/login').post(login)

//secure route
router.route('/signOut').get(verifyJWT, signOut)
router.route('/refreshAccessToken').post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, Upload.single("avatar"), updateUserAvatar)
router.route('/forgotPassword').patch(forgotPassword)

router.route('/userProfile').post(verifyJWT, userProfile)
router.route('/instructorProfile').post(verifyJWT, instructorProfile)
export default router