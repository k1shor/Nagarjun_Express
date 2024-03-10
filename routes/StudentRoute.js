const { registerStudent } = require('../controller/StudentController')
const router = require('express').Router()

router.post('/register',registerStudent)

module.exports = router
