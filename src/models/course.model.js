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
        discription: {
            type: String,
            required: true
        },
        lectures: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)