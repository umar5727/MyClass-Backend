import { Router } from "express";
import { createCourse, getAllCourses, getCourseById, getEnrolledUsers } from "../controllers/course.controller.js";
import { Upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route('/')
    .get(getAllCourses)
    .post(getEnrolledUsers)

router.route('/createCourse').post(
    Upload.fields([
        {
            name: "thumbNail",
            maxCount: 1
        }
    ])
    , createCourse
)
router.route("/:courseId").get(getCourseById)
//     .post(getEnrolledUsers)

export default router