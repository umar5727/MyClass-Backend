import mongoose, { Schema } from "mongoose";


const enrolledSchema = new Schema({
    endroller: {
        type: Schema.Types.ObjectId,    //student that taken course
        ref: 'User'
    },
    course: {
        type: Schema.Types.ObjectId, //which course taked
        ref: "Course"
    }
}, { timestamps: true })

export const Enrolled = mongoose.model('Enrolled', enrolledSchema)