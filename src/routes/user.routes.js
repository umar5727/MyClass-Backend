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

// register swagger  
/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: API endpoint to register a new user by providing necessary details like full name, email, password, etc.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *                 description: "Full name of the user"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *                 description: "Email address of the user"
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: "Password for the user account"
 *               role:
 *                 type: string
 *                 example: "learner"
 *                 description: "Role of the user, defaults to 'user'"
 *     responses:
 *       201:
 *         description: Successfully registered a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "615b3c98f70d0015c2b12345"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     role:
 *                       type: string
 *                       example: "learner"
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred during registration"
 */
// updateProfile swagger  
/**
 * @swagger
 * /api/v1/users/updateProfile:
 *   post:
 *     summary: update user profile
 *     description: API endpoint to update user profile by providing necessary details like full name, email, avatar, etc.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - fullName
 *               - email
 *         
 *             properties:
 *               userId:
 *                 type: string
 *                 example: ""
 *                 description: "userId to find user"
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *                 description: "Full name of the user"
 *               email:
 *                 type: string
 *                 example: ""
 *                 description: "Email address of the user"
 *               
 *     responses:
 *       201:
 *         description: Successfully registered a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "update successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "615b3c98f70d0015c2b12345"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     role:
 *                       type: string
 *                       example: "learner"
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred during registration"
 */

import { Router } from "express";
import { signOut, login, signUp, refreshAccessToken, updateUserAvatar, updateAccountDetails, changeCurrentPassword, forgotPassword, userProfile, instructorProfile, getAllUsers, updateProfile } from "../controllers/user.controller.js";
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
router.route('/updateProfile').post(verifyJWT, updateProfile)
export default router