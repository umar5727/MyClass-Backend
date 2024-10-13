// import { Course } from "../models/course.model.js";
import mongoose from "mongoose";
import { Enrolled } from "../models/enrolled.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllEnrolls = async (req, res) => {
    const enrolls = await Enrolled.find()
    if (!enrolls) {
        return res.status(500).json({ message: 'not able to find enrolls' })
    }
    return res.status(200).json({ enrolls, message: 'get enrolls success' })
}
const addEnrolled = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const { courseId } = req.params

    // console.log(userId, courseId)
    try {
        if (!userId || !courseId) {
            throw new ApiError(400, 'Missing required fields ')
        }

        const alreadyEnrolled = await Enrolled.findOne({
            enroller: userId,
            course: courseId
        })
        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'User already Enrolled in this course' })
        }
        const enrolled = await Enrolled.create({
            enroller: userId,
            course: courseId
        }
        )
    } catch (error) {
        console.log('addEnrolled error : ', error)
    }

    try {
        const myCourses = await Enrolled.find({ enroller: req.user._id }).select('-_id -enroller -createdAt -updatedAt')
        if (!myCourses) {
            console.log('user not enrolled  : ', myCourses)

            return res.status(400).json({ message: "user not enrolled " })
        }

        return res.status(200).json({ myCourses, message: "enrolled success" })
    } catch (error) {
        console.log('mycourses error: ', error)
        return res.status(500).json({ message: "internal server error" })
    }
})

const totalEnroll = async (courseId) => {
    // const { courseId } = req.params
    const enrolls = await Enrolled.find({ course: courseId })
    // console.log("enrolls : ", enrolls.length)
    if (!enrolls) {
        return 0
    }
    const totalEnrolls = enrolls.length

    return totalEnrolls

}
const userCourses = async (req, res) => {

    try {
        const myCoursesList = await Enrolled.find({ enroller: req.user._id }).select('-_id -enroller -updatedAt')
        if (!myCoursesList) {
            console.log('user not enrolled  : ', myCoursesList)

            return res.status(400).json({ message: "user not enrolled in any course" })
        }

        // console.log('enrolles testCourse : ', courseList)
        return res.status(200).json({ myCourses: myCoursesList, message: "user courses found success" })
    } catch (error) {
        console.log('mycourses error: ', error)
        return res.status(500).json({ message: "internal server error" })
    }
}


export { getAllEnrolls, addEnrolled, userCourses, totalEnroll }