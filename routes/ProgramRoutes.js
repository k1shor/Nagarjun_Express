const { addProgram, getAllPrograms, getProgram, updateProgram, deleteProgram } = require('../controller/ProgramController')
const { requireTeacher } = require('../controller/StudentController')
const { ProgramRules, validationFunction } = require('../validation')
const router = require('express').Router()

router.post('/addprogram', requireTeacher, ProgramRules, validationFunction, addProgram)
router.get('/getprograms',getAllPrograms)
router.get('/getprogram/:id', getProgram)
router.put('/updateprogram/:id', requireTeacher,updateProgram)
router.delete('/deleteprogram/:id', requireTeacher,deleteProgram)

module.exports = router