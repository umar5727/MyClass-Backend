// getWishlist
/**
 * @swagger
 * /api/v1/wishlist/getWishlist:
 *   post:
 *     summary: get the user Wishlist
 *     description: API endpoint to get the user wishlist by providing necessary details like accessToken.
 *     tags:
 *       - wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *         
 *             properties:
 *               accessToken:
 *                 type: string
 *                 example: "668ae83fb99d2c25d6afc3c2"
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
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = Router()

router.route('/addToWishlist').post(verifyJWT, addToWishlist)
router.route('/removeFromWishlist').post(verifyJWT, removeFromWishlist)


export default router