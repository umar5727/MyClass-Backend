import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Wishlist } from "../models/wishlist.model.js"

const getWishlist =async (userId)=>{
  // const {userId}= req.body || Id 
  
  if(!userId){
    return res.status(400).json({message: 'user Id required'})
  }

  try {

    const wishlist = await Wishlist.aggregate([
      {
        $match: {
            userId: new mongoose.Types.ObjectId(userId)
        },
      },
      {
        $lookup:{
          from: 'courses',
          localField: 'coursesId',
          foreignField:'_id',
          as: 'courseDetails',
          pipeline:[
            {
              $project:{
                _id:1,
                title:1,
                thumbNail:1,
                totalLectures:1,
                discountPrice:1
              }
            },
          ]
        }
      },
      {
        $project:{
          _id: 1, 
          coursesId:1,
          courseDetails:1,
          
        }
      }
    ])
    // console.log('wishlist get ', wishlist,'\nlist ',wishlist[0].courseDetails)
    return wishlist[0].courseDetails

  } catch (error) {
    console.log('error wishlist ',error)
    return []
  }
  
}

const addToWishlist = async (req,res)=>{
  const {courseId} = req.body
  if(!courseId){
    return res.status(400).json({message:'courseId required'})
  }
  console.log('req',courseId)
  try {
    const wishlist = await Wishlist.findOne({userId:req.user._id})
  if(!wishlist){
   return  res.status(400).json({message:'not able to find list'})
   
  }
    wishlist.coursesId.push(courseId)
  
    await wishlist.save();
    
const wishlistData = await Wishlist.aggregate([
  {
    $match: {
        userId: new mongoose.Types.ObjectId(req.user._id)
    },
  },
  {
    $lookup:{
      from: 'courses',
      localField: 'coursesId',
      foreignField:'_id',
      as: 'courseDetails',
      pipeline:[
        {
          $project:{
            _id:1,
            title:1,
            thumbNail:1,
            totalLectures:1,
            discountPrice:1
          }
        },
      ]
    }
  },
  {
    $project:{
      _id: 1, 
      coursesId:1,
      courseDetails:1,
      
    }
  }
])

   
// console.log('add to wishlist ',wishlistData[0].courseDetails)

    return res.status(200).json({wishlist:wishlistData[0].courseDetails, message:"added to wishlist"})
  } catch (error) {
console.log('not to wishlist ',error)

    return res.status(400).json({message:'not able to add'})
  }
  
}

export {getWishlist, addToWishlist}