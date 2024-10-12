import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        thumbNail: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            required: true,
        },
        discription: {
            type: String,
            // required: true
        },
        totalLectures: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: true
        },
        discountPrice: {
            type: Number,
            required: true
        },
        approved: {
            type: Boolean,
            default: false
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },


    },
    {
        timestamps: true
    }
)
export const Course = mongoose.model('Course', courseSchema)