const ProgramModel = require('../models/ProgramModel')

exports.addProgram = async (req, res) =>{
    let programToAdd = await ProgramModel.create({
        title: req.body.title
    })
    if(!programToAdd){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(programToAdd)
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