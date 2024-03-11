const { signin, authorizeStudent } = require('../controller/StudentController')
const { addSubject, getSubjects, getSubjectByProgram, getSubjectDetails } = require('../controller/SubjectController')

const router = require('express').Router()

router.post('/addsubject',addSubject)
router.get('/subjectlist', getSubjects)
router.get('/subjectbyProgram/:programID', getSubjectByProgram)
router.get('/subjectdetails/:id',authorizeStudent, getSubjectDetails)
router.post('/login', signin)


module.exports = router