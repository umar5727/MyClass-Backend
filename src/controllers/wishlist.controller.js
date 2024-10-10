import { Wishlist } from "../models/wishlist.model"

const getWishlist =async (req,res,Id)=>{
  const {userId}= req.body || Id 
  
  if(!userId){
    return res.status(400).json({message: 'user Id required'})
  }

  try {
    const wishlist = await Wishlist.findOne(userId)
  } catch (error) {
    return res.status()
  }
  
}



export {getWishlist}