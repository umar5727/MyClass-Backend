import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const getAllCourses = asyncHandler(async (req, res) => {

    const courses = await Course.find({}); // Find all documents
    console.log('all courses : ', courses)

    if (!courses) {
        // console.error('Error fetching courses:', error);

        throw new ApiError(401, error, 'faild to get courses data')

    }

    return res.status(200).json(courses)
})
const createCourse = asyncHandler(async (req, res) => {
    const { title, shortDescription, difficulty, totalLectures, duration, department, price, instructor } = req.body
    console.log(
        'body: ', req.body
    )
    console.log("req : ", title, shortDescription, difficulty, totalLectures, duration, department, price)

    if (!title || !shortDescription || !difficulty || !totalLectures || !duration || !department || !price) {
        throw new ApiError(401, 'all fields required')
    }
    if (!mongoose.Types.ObjectId.isValid(instructor)) {
        console.log('error block')
        throw new ApiError(401, 'Instrutor not exist')
    }
    const Instructor = await User.findById(instructor, {
        fullName: true,
        avatar: true,

    })


    const localFilePath = req.files.thumbNail[0].path
    const thumbNail = await uploadOnCloudinary(localFilePath)

    const course = await Course.create({
        title,
        shortDescription,
        difficulty,
        totalLectures,
        duration,
        department,
        price,
        instructor,
        thumbNail: thumbNail.url
    })
    const checkedCourse = await Course.findById(course._id)
    console.log('checked course: ', checkedCourse)

    return res.status(200).json({ course, message: 'successfull' })
})
export { getAllCourses, createCourse }