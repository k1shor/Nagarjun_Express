const { registerStudent, verifyEmail, getAllStudents, getStudentDetails, findStudent } = require('../controller/StudentController')
const router = require('express').Router()

router.post('/register',registerStudent)
router.get('/verifyuser/:token', verifyEmail)
router.get('/studentlist',getAllStudents)
router.get('/studentdetails/:id', getStudentDetails)
router.post('/findstudent', findStudent)

module.exports = router
