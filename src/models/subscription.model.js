import mongoose, { Schema } from "mongoose";


const subscription = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,    //student that taken course
        ref: 'User'
    },
    course: {
        type: Schema.Types.ObjectId, //which course taked
        ref: "course"
    }
})