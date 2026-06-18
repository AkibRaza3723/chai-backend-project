import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//routes import
import userRouter from "./routes/user.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true, // Allow cookies to be sent in cross-origin requests
    // You can also specify other CORS options here, such as allowed methods, headers, etc.
})); 
app.use(express.json({limit: "16kb"})); // Middleware to parse JSON request bodies(accept JSON data in incoming requests and make it available under req.body)
app.use(express.urlencoded({extended: true, limit: "16kb"})); // Middleware to parse URL-encoded request bodies(accept form data in incoming requests and make it available under req.body)
app.use(express.static("public")); // Middleware to serve static files from the "public" directory, it allows you to serve static assets like images, CSS files, and JavaScript files directly from the "public" folder without needing to define specific routes for each file.
app.use(cookieParser()); // Middleware to parse cookies from incoming requests, it allows you to access cookies sent by the client in your route handlers using req.cookies, which is useful for handling authentication, sessions, and other features that rely on cookies.(CRUD operations on cookies, you can set cookies in the response using res.cookie() and read cookies from the request using req.cookies)


//routes declaration (now we have to use middleware to use routers cause it's seperate so use app.use )
app.use("/api/v1/users",userRouter) //http:localhost8000/users now it give control to user then from there we use /register 



export {app}; // Exporting the Express app instance for use in other modules