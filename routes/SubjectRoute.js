const { signin, requireTeacher } = require('../controller/StudentController')
const { addSubject, getSubjects, getSubjectByProgram, getSubjectDetails } = require('../controller/SubjectController')
const { SubjectRules, validationFunction } = require('../validation')

const router = require('express').Router()

router.post('/addsubject', requireTeacher, SubjectRules, validationFunction, addSubject)
router.get('/subjectlist', getSubjects)
router.get('/subjectbyProgram/:programID', getSubjectByProgram)
router.get('/subjectdetails/:id', getSubjectDetails)


module.exports = router