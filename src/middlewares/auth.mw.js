import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const varifyJWT= asyncHandler(async(req,res,next)=>{
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s+/i, ""); //using header for mobile application
     if(!token){
         throw new ApiError(401,"Unauthorized request")
     }
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
     if (!user) {
         // todo : discuss about frontend 
         throw new ApiError(401,"invalid access token")
     }
 
     req.user = user;
     next()
   } catch (error) {
     throw new ApiError(401, error?.message || "invalid access token catch")
   }
//using try catch cause it's database operations there are chances of failure
})