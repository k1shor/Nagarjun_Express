const { addProgram } = require('../controller/ProgramController')
const router = require('express').Router()

router.post('/addprogram', addProgram)

module.exports = router