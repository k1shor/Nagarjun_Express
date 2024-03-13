const UserModel = require('../models/UserModel')
const StudentModel = require('../models/StudentModel')
const TokenModel = require('../models/TokenModel')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const sendEmail = require('../utils/sendEmail')
const jwt = require('jsonwebtoken')
// const { expressjwt } = require('express-jwt')


// const uuidv1 = require('uuidv1')

// register student
exports.registerStudent = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Please provide student photo" })
    }

    const { username, first_name, last_name, gender, email, password, program, semester } = req.body
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
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        program: program,
        semester: semester,
        image: req.file?.path
    })
    // generate token and send in email
    let token = await TokenModel.create({
        user: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    const verify_url = `http://localhost:5000/verifyuser/${token.token}`

    sendEmail({
        from: "noreply@something.com",
        to: email,
        subject: "Verification Email",
        text: "Click on the following link to verify your email " + verify_url,
        html: `<a href='${verify_url}'><button>Verify your account.</button></a>`
    })
    if (!student) {
        return res.status(400).json({ error: "Failed to register student" })
    }
    res.send({ student, user })
}

// verify 
exports.verifyEmail = async (req, res) => {
    // verify the token if correct or not
    let token = await TokenModel.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    // find user
    let user = await UserModel.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User associated with token not found" })
    }
    // check if user is already verified
    if (user.isVerified) {
        return res.status(400).json({ error: "User already registered. Login to continue" })
    }
    // verify user
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Failed to verify. Try again later." })
    }
    res.send({ message: "User verified successfully." })
}

// signin
exports.signin = async (req, res) => {
    // check email
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    // check password
    let hashed_password = await bcrypt.compare(req.body.password, user.password)
    if (!hashed_password) {
        return res.status(400).json({ error: "Email and password do not match" })
    }
    // check isVerified
    if (!user.isVerified) {
        return res.status(400).json({ error: "User not verified. Verify first." })
    }
    // generate login token
    let token = jwt.sign({
        username: user.username,
        role: user.role,
        _id: user._id,
        email: user.email
    }, process.env.JWT_SECRET)

    let { username, role, email } = user
    // login
    // set login information in cookie
    res.cookie('myCookie', token, { expirte: Date.now() + 86400 })

    // res.send({ message: "Login successful" })
    res.send({ token, user: { email, username, role } })
}

// exports.authorizeStudent = expressjwt(
//     {
//         secret: process.env.JWT_SECRET,
//         algorithms: ['HS256']
//     }
// )

// get student list
exports.getAllStudents = async (req, res) => {
    let students = await StudentModel.find().populate('user').populate('program')
    if (!students) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(students)
}

// get student details
exports.getStudentDetails = async (req, res) => {
    let student = await StudentModel.findById(req.params.id).populate('user').populate('program')
    if (!student) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(student)
}
// get student details by name, semeter, program
exports.findStudent = async (req, res) => {
    console.log(req.query)
    // localhost:5000/findstudent?sortBy=first_name&order=ascending
    let order = req.query.order ? req.query.order : '1'
    // 1 - ascending, -1 - desccending, "ASCENDING" or "DESCENDING"/ asc or desc
    let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
    // first_name, last_name, program, semester



    let filter = req.body.filter
    /* filter: {
        program: ['BCA','BBA'],
        semester : ['I','II'],
        firstname: [],
        lastname: [] 
    }
*/
    let students = await StudentModel.find(filter).populate('user').populate('program')
        .sort([[sortBy, order]])
    if (!students) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(students)

}
