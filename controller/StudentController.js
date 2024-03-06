const UserModel = require('../models/UserModel')
const StudentModel = require('../models/StudentModel')
const bcrypt = require('bcrypt')
const uuidv1 = require('uuidv1')

// register student
exports.registerStudent = async (req, res) => {
    const { username, email, password, program, semester } = req.body
    let hashed_password = await bcrypt.hash(password, uuidv1())
    if (!hashed_password) {
        return res.status(503).json({ error: "Something went wrong" })
    }
    let user = await UserModel.create({
        username: username,
        email: email,
        password: hashed_password
    })
    if (!user) {
        return res.status(400).json({ error: "Failed to register user" })
    }
    let student = await StudentModel.create({
        user: user._id,
        program: program,
        semester: semester
    })
    if (!student) {
        return res.status(400).json({ error: "Failed to register student" })
    }
    res.send(student)
}