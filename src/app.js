import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())



//routes import 
import userRouter from "./routes/user.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import courseRouter from "./routes/course.routes.js"
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/dashboard", dashboardRouter)

app.use("/api/v1/courses", courseRouter)


export { app }