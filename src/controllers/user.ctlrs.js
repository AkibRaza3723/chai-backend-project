import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiRes} from "../utils/ApiRes.js"
import {User} from "../models/user.model.js"
import {uploadAtCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAcessTokenAndRefreshTokens = async(userId) => {
    try {
       const user =  await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
 
       user.refreshToken = refreshToken; //just find by id kia hai to password feild bhi hogi yaha jise validate krna padege
       await user.save({validateBeforeSave:false});

       return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req,res)=>{
    const {username, fullName, email, password} = req.body
    console.log("email:",email);
    //from here we can handle data through postman but we can't handle files from here
    // if(fullname===""){ throw new ApiError(400,"fullname is required")}//like this we can check all 
    if([fullName,email,username,password].some((feild)=>feild?.trim()===""))
    {//trim removes the white space
       throw new ApiError(400,"All feilds are required");
    }

    const existedUser = await User.findOne({
     $or : [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"user with email or username already exist");
    }
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path; //? is used to the the fun optional mile to kaam kro ve
    const coverLocalPath = req.files?.coverImage?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is missing from the request. Make sure you are using 'form-data' and the key name is exactly 'avatar'");
    }

    //uplode them to cloudinary
    const avatar = await uploadAtCloudinary(avatarLocalPath)
    const coverImage = await uploadAtCloudinary(coverLocalPath)
    if(!avatar){
         throw new ApiError(400,"Avatar file was received, but failed to upload to Cloudinary. Check your Cloudinary credentials and dotenv setup.");
    }
    
    const user1 = await User.create({
       fullName,
       avatar: avatar.url,
       coverImage: coverImage?.url || "",
       email,
       password,
       username: username.toLowerCase(),
    })
    const checkCreatedUser = await User.findById(user1._id).select(
        "-password -refreshToken"
    )//these will exclude from the response
    
    if (!checkCreatedUser) {
        throw new ApiError(500,"Something when wrong while registering a user");        
    }
    return res.status(201).json(
        new ApiRes(200, checkCreatedUser.toObject(), "user registered sucessfully")
    )
})

const logInUser = asyncHandler(async(req,res)=>{
    const {email,username,password} = req.body
    if (!username && !email) {
        throw new ApiError(400,"username or email is required")
    }
    const user = await User.findOne({$or:[{username},{email}]})
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if(!checkPassword){
        throw new ApiError(401,"password is not valid")
    }

    const {accessToken,refreshToken} = await generateAcessTokenAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    //to send cookies we have to define options
    const options ={
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }//now these cookies are only modifyable from server
    //we have cookies acces through cookies parsers injected.
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiRes(200,{user: loggedInUser.toObject(), accessToken, refreshToken}, "user logged in sucesfully")
    )
})

const logOutUser = asyncHandler(async(req,res)=>{
    //now how we know which user to log out we can't ask them by form so we design a middleware(like cookies)
    await User.findByIdAndUpdate(
        req.user._id,
        {$set:{refreshToken : undefined }},
        {new: true} //return ke response mei new updated value milegi 
    ) //direct find krke update kr diya to no validation of password

    const options ={
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" //use true when using production https
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiRes(200,{},"User logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRT = req.cookies.refreshToken;
   if(!incomingRT){
    throw new ApiError(401,"unauthorized access")
   }
   try {
    const decodedToken = jwt.verify(
     incomingRT,
     process.env.REFRESH_TOKEN_SECRET
    )//cookies mei encoded hota hai database mei decoded
 
    const user = await User.findById(decodedToken?._id)
    if(!user){
     throw new ApiError(401,"Invalid refresh token")
    }
 
    if (incomingRT !== user?.refreshToken) {
      throw new ApiError(401,"refresh token is expired or used")
    }
    
     const {accessToken, newrefreshToken}=await generateAcessTokenAndRefreshTokens(user._id)
    const options ={ //for security purpose
         httpOnly: true,
         secure: process.env.NODE_ENV === "production" //use true when using production https
     }
     
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newrefreshToken,options)
     .json( new ApiRes(
         200,
         {accessToken,refreshToken:newrefreshToken},
         "access token refreshed sucessfully"
     ))
   } catch (error) {
     throw new ApiError(401,error?.message||"invalid refresh token - catch")
   }// we have set the controller for end point now set it into the routes 
})

export {registerUser,logInUser,logOutUser,refreshAccessToken}
