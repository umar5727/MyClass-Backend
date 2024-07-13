import { app } from "./app.js";
import connectDB from "./db/index.js";
// import dotenv from "dotenv"
// const cors = require('cors');
import 'dotenv/config';
// require('dotenv').config()

// dotenv.config({
//     path: './.env'
// })
// app.use(cors({ path: './.env' }));
console.log(process.env.PORT)
connectDB()
    .then(() => {
        app.on('error', (err) => {
            console.log("server error", err)
            throw err
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log("surver is running at port : ", process.env.PORT)
        });
    })
    .catch((err) => {
        console.log("mongodb connection faild --index : ", err)
    })
