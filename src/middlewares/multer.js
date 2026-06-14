import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp") //callback
    //null because we don't have to handle error
    //file : it has all the data and that's why multer is used
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  } //apart from all this we can also use file.originalname
})

export const upload = multer({ storage: storage })