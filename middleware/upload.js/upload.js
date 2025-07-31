const multer = require('multer');
const path = require('path');

const fileFilter = (req,file,cb) =>{
const ext = path.extname(file.originalname).toLowerCase();
const allowExt = [".pdf", ".jpg", ".jpeg", ".png"];

if(allowExt.includes(ext)){
    cb(null,true);
}else{
    cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed!"))
}
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
    cb(null,"uploads/")
    },
     filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
})

const upload = multer({
    storage,
    fileFilter,
    limits:{fileSize: 5*1024*1024}
})

module.exports = upload;