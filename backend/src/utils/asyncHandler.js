const asyncHandler=(fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((err)=>next(err))
    }
}

//upar wal fucntion me return nahi tha so error aya shayad

export {asyncHandler}


//USING TRY_CATCH
// Higher order functions- take function as parameter or return them 
//A function inside function
// const asyncHandler=(fn)=>()=>{} is same as const asyncHandler=(fn)=>{()=>{}} 
// const asyncHandler = (fn) => async(req,res,next) => {
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code|| 500).json({ [sending json response makes it easier to understand the error]
//             success:false,
//             message:error.message
//         })
//     }
// }