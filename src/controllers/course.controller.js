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


// const getEnrolledUsers = asyncHandler(async (req, res) => {
//     const { courseId } = req.params
//     const { userId } = req.body
//     if (!courseId?.trim) {
//         throw new ApiError(400, 'user id not found ')
//     }

//     const enrolled = await Course.aggregate([
//         {
//             $match: {
//                 _id: courseId
//             },
//         },
//         {
//             $lookup: {
//                 from: 'enrolleds',
//                 localField: "_id",
//                 foreignField: "course",
//                 as: 'endrolledUsers'
//             },

//         },
//         {
//             $addFields: {
//                 endrollersCount: {
//                     $size: '$endrolledUsers',
//                 },

//                 isEndrolled: {
//                     $cond: {
//                         if: { $in: [userId, "$endrolledUsers.endroller"] },
//                         then: true,
//                         else: false
//                     }
//                 }
//             },
//         },

//         {
//             $project: {

//                 endrollersCount: 1,
//                 isEndrolled: 1,


//             }
//         }
//     ])

//     if (!enrolled?.length) {
//         console.log("\nenrolled  : ", enrolled)
//         return res.status(200).json({ enrolled: 0 })
//     }

//     return res
//         .status(200)
//         .json(enrolled[0],)
// })


export { getAllCourses, createCourse }