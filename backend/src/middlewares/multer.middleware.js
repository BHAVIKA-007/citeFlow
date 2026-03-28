import multer from 'multer';
// cb is callback
//req has all json data and file has the file coz req body doesnt have files
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/temp') //destination to store files
    },
    // user can put files with same name many time, so we can have our own custom way of storing it
    // but for now we are just keeping the name given by user
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }

})

export const upload = multer ({storage,})