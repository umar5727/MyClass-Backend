
import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
{  userId:{
    type:Schema.Types.ObjectId,
    ref:'Cser'
    
  },
  coursesId:[
    {
      type: Schema.Types.ObjectId,
      ref: "Course"
    } 
  ]
},
{
  timestamps:true
})

export const Wishlist = mongoose.model('Wishlist',wishlistSchema)