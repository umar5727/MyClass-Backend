// getAllEnrolls swagger 
/**
 * @swagger
 * /api/v1/enrolled/getAllEnrolls:
 *   get:
 *     summary: Get all Enrolls
 *     description: Fetch all Enrollements data
 *     responses:
 *       200:
 *         description: Enrolls details fetched successfully
 *       500:
 *         description: Unable to fetch Enrolls details
 */

import { Router } from "express";
import { addEnrolled, getAllEnrolls, userCourses } from "../controllers/enrolled.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route('/getAllEnrolls').get(getAllEnrolls)
router.route('/:courseId/addEnrolled').post(verifyJWT, addEnrolled)

// router.route('/:courseId').post(totalEnrolls)

router.route('/getMyCourses').post(verifyJWT, userCourses)
export default router