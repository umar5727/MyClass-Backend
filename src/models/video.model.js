import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String

    },
    duration: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }

})

export const Video = mongoose.model('Video', videoSchema)