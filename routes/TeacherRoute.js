const { registerTeacher, verifyEmail, getAllTeachers, getTeacherDetails, findTeacher } = require('../controller/TeacherController')
const upload = require('../utils/fileUpload')
const { TeacherRules, validationFunction } = require('../validation')
const router = require('express').Router()

router.post('/register', upload.single('image'), registerTeacher)
router.get('/verifyuser/:token', verifyEmail)
router.get('/teacherlist',getAllTeachers)
router.get('/teacherdetails/:id', getTeacherDetails)
router.post('/findteacher', findTeacher)

module.exports = router
