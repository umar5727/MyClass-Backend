import { Router } from "express";
import { createCourse, getAllCourses } from "../controllers/course.controller.js";
import { Upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route('/')
    .get(getAllCourses)

router.route('/createCourse').post(
    Upload.fields([
        {
            name: "thumbNail",
            maxCount: 1
        }
    ])
    , createCourse
)
router
    .route("/:courseId")
// .post(getEnrolledUsers)

export default router