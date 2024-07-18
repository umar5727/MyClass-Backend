// import { Course } from "../models/course.model.js";
import { Enrolled } from "../models/enrolled.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addEnrolled = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const { courseId } = req.params

    console.log(userId, courseId)
    if (!userId || !courseId) {
        throw new ApiError(400, 'Missing required fields ')
    }

    const alreadyEnrolled = await Enrolled.findOne({
        enroller: userId,
        course: courseId
    })
    if (alreadyEnrolled) {
        return res.status(201).json({ message: 'User already Enrolled in this course' })
    }
    const enrolled = await Enrolled.create({
        enroller: userId,
        course: courseId
    }
    )
    console.log('endrolled user : ', enrolled)

    return res.status(200).json('enrolled success')
})

const totalEnrolls = asyncHandler(async (req, res) => {
    const { courseId } = req.params

    const enrolls = await Enrolled.find({ course: courseId })
    console.log("enrolls : ", enrolls.length)

    return res.status(200).json({ totalenrolls: enrolls.length, message: 'success' })

})



export { addEnrolled, totalEnrolls }