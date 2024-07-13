import express from "express"
import cookieParser from "cookie-parser";
import 'dotenv/config';
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})
)
console.log("cors", process.env.CORS_ORIGIN)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())



//routes import 
import userRouter from "./routes/user.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import courseRouter from "./routes/course.routes.js"
import enrolledRouter from "./routes/enrolled.routes.js"
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/dashboard", dashboardRouter)

app.use("/api/v1/courses", courseRouter)
app.use('/api/v1/enrolled', enrolledRouter)

export { app }