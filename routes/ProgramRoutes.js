const { addProgram, getAllPrograms, getProgram, updateProgram, deleteProgram } = require('../controller/ProgramController')
const router = require('express').Router()

router.post('/addprogram', addProgram)
router.get('/getprograms',getAllPrograms)
router.get('/getprogram/:id', getProgram)
router.put('/updateprogram/:id', updateProgram)
router.delete('/deleteprogram/:id', deleteProgram)

module.exports = router