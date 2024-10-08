import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async (req, _, next) => {

    // console.log('auth middleware: ', req.cookies.accessToken.accessToken)
    try {
        const token = req.cookies?.accessToken?.accessToken || req.header('Authorization')?.replace('Bearer', '') 
        const {accessToken} = req.body
        // console.log('accesstoken : auth ',accessToken)
        if (!token && !accessToken) {           
            throw new ApiError(401, "unAuthorize request")
        }      
if(accessToken){

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)             
    
    const user = await User.findById(decodedToken?._id).select('-password, -refreshToken')
    
    if (!user) {
        throw new ApiError(401, 'invalid token')
    }
    
    req.user = user;
    next()
}else{
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)             
    
    const user = await User.findById(decodedToken?._id).select('-password, -refreshToken')
    
    if (!user) {
        throw new ApiError(401, 'invalid token')
    }
    
    req.user = user;
    next()

}
    } catch (error) {
        throw new ApiError(401, error?.message || 'invalid token')
    }
})