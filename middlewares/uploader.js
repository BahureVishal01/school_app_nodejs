const multer = require("multer");
const path = require("path");
const fs = require('fs')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(`uploads/users/`, { recursive: true })
    cb(null, `uploads/users/`)
  },
  filename: (req, file, cb) => {

    let fileName = `${Date.now()}-${file.originalname.toLowerCase().split(' ').join('-')}`
    cb(null, fileName)
  }
 
});

var imageUpload = multer({storage: storage, fileFilter: (req, file, cb) => {
  cb(null, true);
}
});
module.exports = imageUpload;