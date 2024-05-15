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
    const { fullName, userName, email, password } = req.body;
    if (
        [fullName, userName, email, password].some((fields) =>
            fields.trim() === ''
        )
    ) {
        throw new ApiError(400, 'fill the required fields ')
    }
    //checking the user is already exist or not 
    const exisedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (exisedUser) {
        throw new ApiError(409, "user is already exist")
    }
    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = files.avatar[0].path
    }
    else {
        avatarLocalPath = '';
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
        avatar: avatar?.url || ''
    })


    const createdUser = await User.fineById(user_id).select("-password -refreshToken")

    res.status(201).json(
        new ApiResponse(201, createdUser, "signup successfully")

    )
}
)

// login
const login = asyncHandler(async (req, res, next) => {
    const { userName, password } = req.body
    if (!userName || !password) {
        throw new ApiError(401, 'All field required')

    }

    const currentUser = await User.findOne(userName)
    if (!currentUser) {
        throw new ApiError(401, 'user not found')
    }
    const checkpassword = await currentUser.checkPassword(password)
    if (!checkpassword) {
        throw new ApiError(400, 'incorrect password')
    }
    //generation tokens
    const { accessToken, refreshToken } = await genAccAndRefToken(currentUser._id)

    // db call 'getting user without password and refresh token'
    const loginUser = User.findById(currentUser._id).select("--password --refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookies('accessToken', accessToken, options)
        .cookies('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                201,
                { user: loginUser, accessToken, refreshToken },
                'login success'
            )
        )
})
export { signUp, login }