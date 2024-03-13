const multer = require('multer')
const fs = require('fs')
const pathname = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dstn = 'public/uploads'
        if (!fs.existsSync(dstn)) {
            fs.mkdirSync(dstn, { recursive: true })
        }
        cb(null, dstn)
    },
    filename: function (req, file, cb) {
        let ext = pathname.extname(file.originalname)
        let filename = pathname.basename(file.originalname, ext)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        let finalname = filename + uniqueSuffix + ext
        cb(null, finalname)
    }
})

const fileFilter = (req, file, next) => {
    if (!file.originalname.match(/[.](jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        return next(new Error("Invalid file format"), false)
    }
    next(null, true)
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 200000
    }
})

module.exports = upload


