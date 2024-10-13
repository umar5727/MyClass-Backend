import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Wishlist } from "../models/wishlist.model.js"

const getWishlist =async (userId)=>{
  // const {userId}= req.body || Id 
  
  if(!userId){
    return res.status(400).json({message: 'user Id required'})
  }
  const wishlist = await Wishlist.findOne({userId:userId})

  if(!wishlist){
    return []
  }
  // console.log("wishlist : ",wishlist.coursesId)
  return wishlist.coursesId
  
}

const addToWishlist = async (req,res)=>{
  const {courseId} = req.body
  if(!courseId){
    return res.status(400).json({message:'courseId required'})
  }
  
  const list = await Wishlist.findOne({userId:req.user._id})
  
  if(!list ){
    return res.status(400).json({message:'courseId required'})
  }

  const courseExists = list.coursesId.includes(courseId)
if(courseExists){ 
    console.log('already in wishlist ',courseExists,list.coursesId.length)
    return res.status(400).json({message:'already in wishlist'})
}
if(!courseExists){
 try {
   const wishlist = await Wishlist.findOneAndUpdate(
     {
       userId: new mongoose.Types.ObjectId(req.user._id)
     },
     {
       $addToSet:{
         coursesId: new mongoose.Types.ObjectId(courseId)
       }
     },{
      new:true,
      projection:{coursesId:1}
     }
   )
   
    console.log('added to wishlist ',wishlist.coursesId.length)
    return res.status(200).json({wishlist: wishlist.coursesId,message:'added Success'})
    
 } catch (error) {
  return res.status(400).json({message:'not able to add '})
 }
}
}
const removeFromWishlist = async (req,res)=>{
  const {courseId} = req.body
  if(!courseId){
    return res.status(400).json({message:'courseId required'})
  }
  const list = await Wishlist.findOne({userId:req.user._id})
  
  if(!list ){
    return res.status(400).json({message:'list not found'})
  }

  const courseExists = list.coursesId.includes(courseId)
  console.log('courseExists ',courseExists, list.coursesId.length)
if(!courseExists){ 
  console.log('not in wishlist ',list.coursesId.length)
  return res.status(400).json({message:'not in wishlist '})
}
if(courseExists){
try {
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      {userId: new mongoose.Types.ObjectId(req.user._id)},
      {
        $pull:{coursesId: new mongoose.Types.ObjectId(courseId)}
      },
      {
        new : true,    //return the updated doucment 
        projection:{coursesId:1}
      }
    )
   
     
      console.log('updated wishlist success ',updatedWishlist.coursesId.length)
      return res.status(200).json({wishlist:updatedWishlist.coursesId, message:'removed from wishlist '})
} catch (error) {
  console.log('server error ',error)
    return res.status(500).json({message:'internal server error'})
}
}
  

}

export {getWishlist, addToWishlist,removeFromWishlist}