import express from "express"
import cookieParser from "cookie-parser";
import 'dotenv/config';
import cors from "cors"

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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

//swagger UI

const swaggerOptions = {
    definition: {
      openapi: "3.0.0", // OpenAPI version
      info: {
          title: "Fountain API", // Title of the API
          version: "1.0.0", // Version of the API
          description: "A simple API documentation", // Description of the API
      },
      servers: [
        {
          url: "http://localhost:8800", // Your server URL
        },
       
      ],
      schemes: ["http", "https"],
    },
    apis: ["./src/routes/*.js",'./routes/*.js'],
  };
  const swaggerDoc = swaggerJSDoc(swaggerOptions);
  // swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


//routes import 
import userRouter from "./routes/user.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import courseRouter from "./routes/course.routes.js"
import enrolledRouter from "./routes/enrolled.routes.js"
import wishlist from "./routes/wishlist.routes.js"
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/dashboard", dashboardRouter)

app.use("/api/v1/courses", courseRouter)
app.use('/api/v1/enrolled', enrolledRouter)

app.use('/api/v1/wishlist', wishlist)
export { app }