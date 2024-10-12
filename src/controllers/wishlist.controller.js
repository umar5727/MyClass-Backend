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
  console.log("wishlist : ",wishlist.coursesId)
  return wishlist.coursesId
  
}

const addToWishlist = async (req,res)=>{
  const {courseId} = req.body
  if(!courseId){
    return res.status(400).json({message:'courseId required'})
  }

 try {
   const wishlist = await Wishlist.updateOne(
     {
       userId: new mongoose.Types.ObjectId(req.user._id)
     },
     {
       $addToSet:{
         coursesId: new mongoose.Types.ObjectId(courseId)
       }
     }
   )
   if(wishlist.nModified >0){
     return res.status(200).json({wishlist: wishlist.coursesId,message:'added Success'})
   }else{
    return res.status(400).json({message:'already in wishlist'})
    }
 } catch (error) {
  return res.status(400).json({message:'not able to add '})
 }
   
}

export {getWishlist, addToWishlist}