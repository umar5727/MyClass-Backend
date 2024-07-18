import { Router } from "express";
import { addEnrolled, totalEnrolls } from "../controllers/enrolled.controller.js";

const router = Router();
router.route('/:courseId/addEnrolled').post(addEnrolled)

router.route('/:courseId').post(totalEnrolls)
export default router