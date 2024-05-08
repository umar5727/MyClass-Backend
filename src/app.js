import express from "express"
import cors from "cors"


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//types of data expect setting
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ limit: '16kb', extended: true }))
app.use(express.static('public'))
//cookiesParser is reaming


//routes import 
import userRouter from "./routes/user.routes.js"
//routes declaration
app.use('/api/v1/users', userRouter)


export { app }