const UserModel = require('../models/UserModel')
const StudentModel = require('../models/StudentModel')
const TokenModel = require('../models/TokenModel')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const sendEmail = require('../utils/sendEmail')
// const uuidv1 = require('uuidv1')

// register student
exports.registerStudent = async (req, res) => {
    const { username, email, password, program, semester } = req.body
    let salt = await bcrypt.genSalt(10)
    let hashed_password = await bcrypt.hash(password, salt)
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
// generate token and send in email
let token = await TokenModel.create({
    user: user._id,
    token: crypto.randomBytes(16).toString('hex')
})
if(!token){
    return res.status(400).json({error:"Something went wrong"})
}

sendEmail({
    from: "noreply@something.com",
    to: email,
    subject:"Verification Email",
    text: "Click on the following link to verify your email " + token.token,
    html: `<button>Verify your account.</button>`
})


    if (!student) {
        return res.status(400).json({ error: "Failed to register student" })
    }
    res.send({student, user})
}