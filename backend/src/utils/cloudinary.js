import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
// import dotenv from "dotenv";
// dotenv.config();

console.log("Cloudinary ENV:", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath, options = {}) => {
    try{
        if(!localFilePath) return null;
        //uploading on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" ,//we have imgae audio video etc, auto detects automatially 
            ...options
        })
        //if sucessful
        console.log("file is uploaded on clpudinary");
        console.log(response.url); //we get public url for us
        fs.unlinkSync(localFilePath)
        return response; // 
    }
    catch(error){
    console.log("❌ CLOUDINARY ERROR:", error.message);   // 🔥 important
    console.log("❌ FULL ERROR:", error);                 // 🔥 important

    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
    }
    return null;
}
}

export {uploadOnCloudinary}












