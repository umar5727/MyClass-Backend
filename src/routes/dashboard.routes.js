import { Router } from "express";
import { getStudentCourses } from "../controllers/dashboard.controller.js";

const router = Router()

router.route('/getStudentCourses').get(getStudentCourses)

export default router