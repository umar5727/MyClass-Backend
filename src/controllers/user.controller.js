import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'

// common function that generate access and refresh token
const genAccAndRefToken = async (userId) => {
    const exisedUser = await User.findById(userId);

    const accessToken = await exisedUser.genAccToken()
    const refreshToken = await exisedUser.genRefToken()

    exisedUser.refreshToken = refreshToken


    await exisedUser.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
}
//get all users 
const getAllUsers = async(req,res,next) =>{
    const users = await User.find().select('fullName email role verified approved');

    if(!users ){
        return res.status(400).json({message:'users not found'})
    }
    return res.status(200).json({users,message:"all user get success"})
}

//signUp or registration
const signUp = asyncHandler(async (req, res, next) => {

    const { fullName, email, password } = req.body;
    let { role } = req.body;
    console.log('req-body: ', req.body)
    // console.log('fullname: ', fullName)
    if (
        [fullName, email, password].some((fields) => {
            try {               // try/catch handls the typeError if fields is undefined 
                return fields.trim() === ''     //removing spacess and checking the field is empty or not
            } catch (error) {
                return true;                   //if fields is undefine return false 
            }
        }
        )
    ) {
        throw new ApiError(400, 'fill the required fields ')  //if statement
    }
    //checking the user is already exist or not  in the database 
    const exisedUser = await User.findOne({
        email
    })
    if (exisedUser) {
        // throw new ApiError(409, "user is already exist")
        console.log('user exist', exisedUser)
        res.status(400).json({ message: 'user is already exist' })
        return;
    }
    if (!role) {
        role = 'learner';         //defining the role of user 
    }

    let avatarLocalPath = null;
    // console.log('local path : ', avatarLocalPath)
    if (req.files && req.files.avatar) {
        avatarLocalPath = req.files.avatar[0].path
        console.log('avatar : ', avatarLocalPath)
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log("avatar file from cloudinary :  ", avatar)
        //checking cloudinary     response
    }
    else {
        console.log('avatar is undefine req not get')
        avatarLocalPath = '';
    }
   

    const user = await User.create({
        fullName,
        email,
        password,
        role,
        avatar: avatar?.url || ''          //if avatar is present only then adding its url
    })


    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(201).json(
        new ApiResponse(201, createdUser, "signup successfully")

    )
}
)

// login
const login = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body
    console.log('req.body: ', req.body)
    console.log('\nlogin details: \n ' + userName + " - " + email + " - " + password)
    if (!(userName || email) || !password) {
        res.status(401).json({ message: 'All field required' })
        return;

    }

    const currentUser = await User.findOne({
        email
    })

    if (!currentUser) {
        res.status(401).json({ message: 'Sorry, looks like that’s the wrong email ' })
        return; //exit the function if not found the user
    }

    if (currentUser.role === 'instructor' && !currentUser.approved) {
        res.status(401).json({ message: "Welcome to our learning community. Your profile is currently under review, and you can Login once your profile is approved by team. In the meantime, you can browse our course catalog and get familiar with the platform!" })
        return;
    }

    const checkpassword = await currentUser.checkPassword(password)
    if (!checkpassword) {
        res.status(401).json({ message: 'incorrect password' })
        return; //exit the function if password is incorrect
    }
    //generation tokens
    const { accessToken, refreshToken } = await genAccAndRefToken(currentUser._id)

    // db call 'getting user without password and refresh token'
    const loginUser = await User.findById(currentUser._id).select("-password -refreshToken")
    // i have not add 'await'while finding user findById 
    console.log('\n loginUser from database: ' + loginUser)
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }
    return res
        .status(200)
        .cookie('accessToken', { accessToken, options })
        .cookie('refreshToken', { refreshToken, options })
        .json(
            new ApiResponse(
                201,
                { user: loginUser, accessToken, refreshToken },
                'login success'
            )
        )
})
//logout SARTS

const signOut = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    console.log("signout")
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, '', 'user logged out ')
        )
})

// refresh accesstoken
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken?.refreshToken || req.body.refreshToken
    console.log("incomming ", incomingRefreshToken)
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        // if (incomingRefreshToken !== user.refreshToken) {
        //     throw new ApiError(401, "Refresh token is expired or used")

        // }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await genAccAndRefToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", { accessToken, options })
            .cookie("refreshToken", { refreshToken, options })
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }


})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const currentUser = await User.findById(req.user?._id)
    const isPasswordCorrect = await currentUser.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    currentUser.password = newPassword
    await currentUser.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        )
})

const forgotPassword = asyncHandler(async (req, res) => {
    const email = req.body
    if (!email) {
        throw new ApiError(400, 'email required')
    }
    const currentUser = await User.findOne(
        { email: email }
    )
    if (!currentUser) {
        throw new ApiError(400, 'email is not registerd')
    }
    // send verification code on uesrs email and then change the password 
})

const userProfile = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId?.trim()) {
        throw new ApiError(400, 'user id not found ')
    }
    const userCoursesDetails = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            },
        },
        {
            $lookup: {
                from: 'enrolleds',
                localField: "_id",
                foreignField: "endroller",
                as: 'userCourses',
                pipeline: [
                    {
                        $lookup: {
                            from: "courses",
                            localField: "course",
                            foreignField: "_id",
                            as: "courseDetails",
                            pipeline: [
                                {
                                    $project: {
                                        title: 1,
                                        thumbNail: 1,
                                        totalLectures: 1
                                    }
                                }
                            ]
                        }
                    }, {
                        $addFields: {
                            courseDetails: {
                                $first: "$courseDetails"

                            }
                        }
                    }
                ]
            },

        },
        {
            $addFields: {
                coursesCount: {
                    $size: '$userCourses',
                },
            },
        },
        {
            $project: {
                coursesCount: 1,
                userCourses: 1,
            }
        }

    ])
    // const { courseDetails } = userCoursesDetails[0].userCourses

    console.log("pipeline : ", userCoursesDetails[0].userCourses[0].courseDetails)
    return res.status(200).json({ "userCourses": userCoursesDetails[0].userCourses, 'message': 'all courses details' })
})

const instructorProfile = asyncHandler(async (req, res) => {
    const { userId } = req.body
    console.log(userId)
    if (!userId) {
        throw new ApiError(400, 'user id required')
    }

    const instructorCoursesDetails = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: "_id",
                foreignField: "instructor",
                as: 'myCourses',
                pipeline: [
                    {
                        $lookup: {
                            from: "enrolleds",
                            localField: "_id",
                            foreignField: "course",
                            as: "enrolledStudents",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        email: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            studentsCount: {
                                $size: "$enrolledStudents"
                            },
                            courseDetails: {
                                $first: "$enrolledStudents"

                            }
                        }
                    }
                ]
            },

        },
        {
            $addFields: {
                coursesCount: {
                    $size: '$myCourses',
                },
            },
        },
        // {
        //     $project: {
        //         enrolledStudents: 1,
        //         myCourses: 1
        //     }
        // }

    ])
    console.log("\n : ", instructorCoursesDetails[0].myCourses)
    return res.status(200).json({ "userCourses": instructorCoursesDetails[0].myCourses, 'message': 'all courses details' })
})

const userCourses = async (req,res)=>{
    const {userId} = req.body
    if(!userId ){
        return res.status(400).json({message:'user Id required'})
    }
    const user = await User.findById(userId)
    
    if(!user){
        return res.status(400).json({message:'user not found'})
        
    }
    const userCourses = await Enrolled.find({enroller:userId})
    return res.status(200).json({userCourses,message:"user courses found success"})
}

const updateProfile = async (req,res)=>{
    
    const {userId,email,fullName,contactNumber} = req.body
    console.log('avatar for user controller : ',req.files.avatar[0].path)

    if(!userId && !email && !fullName && !req.files.avatar){
        return res.status(400).json({message:'required a field'})
    }

    const user = await User.findById(userId)
    if(!user){
        return res.status(400).json({message:'user not found'})
    }
    if(fullName !== ' ' && fullName){
        user.fullName = fullName
    }
    if(email !== ' ' && email){
        user.email = email
    }
    if(contactNumber !== ' ' && contactNumber){
        user.contactNumber = email
    }
    if(req.files && req.files.avatar){
        const avatar = await uploadOnCloudinary(req.files.avatar[0].path)
        user.avatar = avatar.url
        console.log('avatar updated',avatar.url)

    }
    await user.save()
    const updatedUser= await User.findById(userId).select('-password')
console.log('after update user : ',updatedUser)
    return res.status(200).json({user:updatedUser, message:'update successful'})
}
export { getAllUsers, signUp, login, signOut, refreshAccessToken, changeCurrentPassword, updateAccountDetails, updateUserAvatar, forgotPassword, userProfile, instructorProfile,updateProfile }