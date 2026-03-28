import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async(req,res,next)=>{
    // will need header thingy when we request is sent via an app
    try{const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    console.log("Cookies:", req.cookies);
console.log("Authorization Header:", req.header("Authorization"));
console.log("Token:", token);
    if(!token){
        throw new ApiError(401,"unauthorized request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
    )

    if(!user){
        throw new ApiError(404,"Invalid Access TOken")
    }

    req.user = user;
    next()
}catch(error){
    throw new ApiError(401,error?.message || "Invalid access token")
}

})