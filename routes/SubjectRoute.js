const { addSubject, getSubjects, getSubjectByProgram, getSubjectDetails } = require('../controller/SubjectController')

const router = require('express').Router()

router.post('/addsubject',addSubject)
router.get('/subjectlist', getSubjects)
router.get('/subjectbyProgram/:programID', getSubjectByProgram)
router.get('/subjectdetails/:id', getSubjectDetails)


module.exports = router