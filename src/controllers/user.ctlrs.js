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

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    // we don't have to check user log in hai ya nhi cause ham auth.mw laga denge route mei to check
    const {oldPassword,newPassword} = req.body
    //now auth middleware use hua hai to user exist karega req.body mei as we set it in the last of it 
    const user= await User.findById(req.user?._id)
    const ispasswordcorrect = await user.isPasswordCorrect(oldPassword);
    if (!ispasswordcorrect) {
        throw new ApiError(400,"invalid old password");
    } // method created in user model
    user.password =newPassword;
    await user.save({validateBeforeSave:false})//baki ke validation nhi run krne
    //now run another created model pre to hash the new paassword (pre save se just pehle chalta hai)

    return res.status(200).json(new ApiRes(200,{},"data update sucesfully"))
})
const getCurrentUser = asyncHandler(async (req,res) => {
    return res.status(200).json(new ApiRes(200, req.user ,"current user fetch sucessfully"))
}) //here we also use varifyjwt so req.user contains all the details about user

//can create updation like above 

const updateUserAvatar = asyncHandler(async(req,res)=> { //using multer middle ware for using req.files also auth for authentication 
    const avatarLocalPath = req.file?.path //req the path of the image that are sent to update?
    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar file is missing")
    }
    const avatar = await uploadAtCloudinary(avatarLocalPath)
    if (!avatar) {
      throw new ApiError(400,"error while uploading on clodinary")        
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{$set:{
        avatar: avatar.url 
    }},{new:true}).select("-password")

    return res.status(200).json( new ApiRes(200,user,"avatar immage updated sucessfully"))
})

export {registerUser,logInUser,logOutUser,refreshAccessToken,changeCurrentPassword, getCurrentUser, updateUserAvatar};
