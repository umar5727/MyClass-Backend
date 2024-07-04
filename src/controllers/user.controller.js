import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// common function that generate access and refresh token
const genAccAndRefToken = async (userId) => {
    const exisedUser = await User.findById(userId);
    const accessToken = exisedUser.genAccToken()
    const refreshToken = exisedUser.genRefToken()

    exisedUser.refreshToken = refreshToken
    await exisedUser.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
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
    }
    else {
        console.log('avatar is undefine req not get')
        avatarLocalPath = '';
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("avatar file from cloudinary :  ", avatar)
    //checking cloudinary     response

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
        res.status(401).json({ message: "Welcome to our learning community! We're excited to have you on board. Your profile is currently under review, and we aim to approve new profiles within [estimated timeframe]. In the meantime, you can browse our course catalog and get familiar with the platform!" })
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
        secure: true
    }
    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                201,
                { user: loginUser, accessToken, refreshToken },
                'login success'
            )
        )
})
//logout

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

    options = {
        httpOnly: true,
        secure: true
    }
    console.log("signout")
    return res
        .status(200)
        .clearCookies("accessToken", options)
        .clearCookies("refreshToken", options)
        .json(
            new ApiResponse(200, '', 'user logged out ')
        )
})
export { signUp, login, signOut }