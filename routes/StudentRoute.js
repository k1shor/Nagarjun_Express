const { registerStudent, verifyEmail, getAllStudents, getStudentDetails, findStudent } = require('../controller/StudentController')
const upload = require('../utils/fileUpload')
const { StudentRules, validationFunction } = require('../validation')
const router = require('express').Router()

router.post('/register', upload.single('image'), StudentRules, validationFunction, registerStudent)
router.get('/verifyuser/:token', verifyEmail)
router.get('/studentlist',getAllStudents)
router.get('/studentdetails/:id', getStudentDetails)
router.post('/findstudent', findStudent)

module.exports = router
