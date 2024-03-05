const SubjectModel = require('../models/SubjectModel')

// add subject
exports.addSubject = async (req, res) => {
    let subject = await SubjectModel.findOne({
        subject_code : req.body.subject_code
    })
    if(subject){
        return res.status(400).json({error:"Subject already exists with same subject_code"})
    }
    subject = await SubjectModel.findOne({
        title: req.body.title,
        program: req.body.program
    })
    if(subject){
        return res.status(400).json({error:"Subject already exists"})
    }
    let subjectToAdd = await SubjectModel.create({
        title: req.body.title,
        subject_code: req.body.subject_code,
        program: req.body.program,
        credit: req.body.credit
    })
    if(!subjectToAdd){
        return res.status(400).json({error:"Failed to add subject"})
    }
    res.send(subjectToAdd)
}

// to get all subjects
exports.getSubjects = async (req, res)=> {
    let subjects = await SubjectModel.find().populate('program','title')
    if(!subjects){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(subjects)
}
// to get subject of a program
exports.getSubjectByProgram = async(req, res) => {
    let subjects = await SubjectModel.find({program:req.params.programID})
    .populate('program','title')
    if(!subjects){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(subjects)
}
// to get subject details
exports.getSubjectDetails = async (req, res) => {
    let subject = await SubjectModel.findById(req.params.id).populate('program')
    if(!subject){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(subject)
}