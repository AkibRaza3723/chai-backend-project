//assuming local server pe file aagyi hai ab use leke bass cloudinary pe dalna hai
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //file system of node js (used to read write remove)

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

const uploadAtCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
            });
        //file has been uploaded sucessfully
        //console.log("file is uploaded sucessfully", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        fs.unlinkSync(localFilePath)
        //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadAtCloudinary}





















// async function(LocalFilePath){
//     const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
// } //why error? cloudinary method on their website