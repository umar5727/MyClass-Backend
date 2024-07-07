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
            required: true
        },
        totalLectures: {
            type: String,
            required: true
        },
        duration: {
            type: number,
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
            type: number,
            required: true
        },
        discountPrice: {
            type: number,
            required: true
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        instructor: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },

    },
    {
        timestamps: true
    }
)
export const Course = mongoose.model('Course', courseSchema)