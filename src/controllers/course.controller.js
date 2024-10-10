import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Enrolled } from "../models/enrolled.model.js";
import { totalEnrolls } from "./enrolled.controller.js";


const getAllCourses = asyncHandler(async (req, res) => {
     const courses = await Course.find({}); // Find all documents
      if (!courses) {
        throw new ApiError(401, error, 'faild to get courses data')
    }
    return res.status(200).json(courses)
})

  
const createCourse = asyncHandler(async (req, res) => {
    const { title, shortDescription, difficulty, totalLectures, duration, department, price, instructor } = req.body
    // console.log(     'body: ', req.body    )
    // console.log("req : ", title, shortDescription, difficulty, totalLectures, duration, department, price)

    if (!title || !shortDescription || !difficulty || !totalLectures || !duration || !department || !price) {
        throw new ApiError(401, 'all fields required')
    }
    if (!mongoose.Types.ObjectId.isValid(instructor)) {
        // console.log('error block')
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
    // console.log('checked course: ', checkedCourse)

    return res.status(200).json({ course, message: 'successfull' })
})
const getCourseById =async (req,res)=>{
    const { courseId } = req.params
    // console.log('course id ', courseId)
    const course = await Course.findById(courseId).select('-discription')
    if(!course){
        return res.status(400).json({message:'course not found'})
    }
    const enrolls = await Enrolled.find({ course: courseId })
    // console.log("enrolls : ", enrolls.length)
    const totalEnrolls = enrolls.length
    const courseData = {            
        ...course.toObject(),      //converting mongoose model to plain object         
        totalEnrolls                
    }

    return res.status(200).json({courseData, message: 'success' })
}

const getEnrolledUsers = asyncHandler(async (req, res) => {
    const { courseId } = req.params
    // const { userId } = req.body
    if (!courseId?.trim) {
        throw new ApiError(400, 'user id not found ')
    }

    const enrolled = await Course.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId)
            },
        },
        {
            $lookup: {
                from: 'enrolleds',
                localField: "_id",
                foreignField: "course",
                as: 'endrolledUsers',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'enroller',
                            foreignField: '_id',
                            as: 'courseUserDetails',
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        avatar: 1,

                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            courseUserDetails: {
                                $first: '$courseUserDetails'
                            }
                        }
                    }
                ]

            },

        },
        {
            $addFields: {
                enrollersCount: {
                    $size: '$endrolledUsers',
                },
            },
        },
        // {
        //     $project: {

        //         endrollersCount: 1,
        //         isEndrolled: 1,


        //     }
        // }
    ])

    // console.log("pipeline : ", enrolled)
    //     if (!enrolled?.length) {
    //         console.log("\nenrolled  : ", enrolled)
    //         return res.status(200).json({ enrolled: 0 })
    //     }

    //     return res
    //         .status(200)
    //         .json(enrolled[0],)
})

// const getAllCoursesWithPipeline = asyncHandler(async (req, res) => {

//     try{
//     const pipeline =[
//         {
//             $lookup:{
//                 from:'user',
//                 localField:'instructor',
//                 foreignField: '_id',
//                 as:'instructorData'
//         },
//     },
//         {
//             $unwind:'$instructorData'
//         },
//         {
//             $lookup: {
//               from: 'userWishlists',
//               let: { userId: userId, courseId: '$_id' },
//               pipeline: [
//                 {
//                   $match: {
//                     $and: [
//                       { userId: '$$userId' },
//                       { course_id: '$$courseId' }
//                     ]
//                   }
//                 }
//               ],
//               as: 'isWishlist'
//             }
//           },
//           {
//             $project: {
//               _id: 1,
//               title: 1,
//               description: 1,
//               instructor: { $concat: ["$instructor.firstName", " ", "$instructor.lastName"] },
//               instructorPhoto: "$instructor.photo",
//               isWishlist: { $size: '$isWishlist' }
//             }
//           }
//         ];
    
//         const courses = await Course.aggregate(pipeline);
//         return res.status(200).json(courses)

//     } catch (error) {
//         console.error('Error fetching courses:', error);
//         throw error;
//       }

// })
export { getAllCourses, createCourse, getEnrolledUsers, getCourseById }