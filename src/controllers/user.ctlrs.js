import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiRes} from "../utils/ApiRes.js"
import {User} from "../models/user.model.js"
import {uploadAtCloudinary} from "../utils/cloudinary.js"

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
        new ApiRes(200,checkCreatedUser,"user registered sucessfully")
    )
})


export {registerUser}