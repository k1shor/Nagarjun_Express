const ProgramModel = require('../models/ProgramModel')

exports.addProgram = async (req, res) => {
    let program = await ProgramModel.findOne({ title: req.body.title })
    if (program) {
        return res.status(400).json({ error: "Program already exists." })
    }
    let programToAdd = await ProgramModel.create({
        title: req.body.title
    })
    if (!programToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(programToAdd)
}


exports.getAllPrograms = async (req, res) => {
    let programs = await ProgramModel.find()
    if (!programs) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(programs)
}

exports.getProgram = async (req, res) => {
    let program = await ProgramModel.findById(req.params.id)
    if (!program) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(program)
}

exports.updateProgram = async (req, res) => {
    try {
        let programToUpdate = await ProgramModel.findByIdAndUpdate(req.params.id, {
            title: req.body.title
        }, { new: true })
        if (!programToUpdate) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.send(programToUpdate)
    }
    catch (error) {
        return res.status(400).json({ error: error })
    }
}

exports.deleteProgram = (req, res) => {
    ProgramModel.findByIdAndDelete(req.params.id)
        .then(programToDelete => {
            if (!programToDelete) {
                res.status(400).json({ error: "Program NOt Found" })
            }
            else {
                res.send({ message: "Program Deleted Successfully." })
            }
        })
        .catch((error) => res.status(400).json({ error: "SOmething went wrong" }))
}

/*
req.body -> form 
req.query -> url, using variables
req.params -> url, using default 

res.send(obj)  -> status: 200
res.send({title:'sdfsdf'}) 

status : 200 success
400 error -> bad request
503 -> 
404 -> page not found

res.json(obj)
*/