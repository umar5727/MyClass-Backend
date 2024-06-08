import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
// console.log('cloud_name: ' + process.env.CLOUDINARY_CLOUD_NAME + "\napi_key: " + process.env.CLOUDINARY_API_KEY + "\napi_secret: " + process.env.CLOUDINARY_API_SECRET + "\ncross_origin: " + process.env.CORS_ORIGIN)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

});


const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        //file has been uploaded on cloudinary successfully
        // console.log('file has been uploaded on cloadinary', response.url);
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch (error) {
        console.log('cloudinary error : ', error)
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operatin got failed
        return null
    }


}

export { uploadOnCloudinary };