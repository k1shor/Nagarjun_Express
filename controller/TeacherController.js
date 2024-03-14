const UserModel = require('../models/UserModel')
const TeacherModel = require('../models/TeacherModel')
const TokenModel = require('../models/TokenModel')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const sendEmail = require('../utils/sendEmail')
const jwt = require('jsonwebtoken')
// const { expressjwt } = require('express-jwt')


// const uuidv1 = require('uuidv1')

// register teacher
exports.registerTeacher = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Please provide teacher photo" })
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
    let teacher = await TeacherModel.create({
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
    if (!teacher) {
        return res.status(400).json({ error: "Failed to register teacher" })
    }
    res.send({ teacher, user })
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

// exports.authorizeTeacher = expressjwt(
//     {
//         secret: process.env.JWT_SECRET,
//         algorithms: ['HS256']
//     }
// )

// get teacher list
exports.getAllTeachers = async (req, res) => {
    let teachers = await TeacherModel.find().populate('user').populate('program')
    if (!teachers) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(teachers)
}

// get teacher details
exports.getTeacherDetails = async (req, res) => {
    let teacher = await TeacherModel.findById(req.params.id).populate('user').populate('program')
    if (!teacher) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(teacher)
}
// get teacher details by name, semeter, program
exports.findTeacher = async (req, res) => {
    console.log(req.query)
    // localhost:5000/findteacher?sortBy=first_name&order=ascending
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
    let teachers = await TeacherModel.find(filter).populate('user').populate('program')
        .sort([[sortBy, order]])
    if (!teachers) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(teachers)

}


// admin middleware 
exports.requireAdmin = (req, res, next) => {
    expressjwt({
      secret: process.env.JWT_SECRET,
      algorithms: ['HS256'],
      userProperty:'auth'
    })(req, res, (err) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (req.auth.role === "teacher") {
        next();
      } else {
        return res.status(403).json({ error: 'You are not authorized to access this page' });
      }
    })
  }

  // user middleware 
exports.requireUser = (req, res, next) => {
    expressjwt({
      secret: process.env.JWT_SECRET,
      algorithms: ['HS256'],
      userProperty:'auth'
    })(req, res, (err) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (req.auth.role === "teacher") {
        next();
      } else {
        return res.status(403).json({ error: 'You are not authorized to access this page' });
      }
    })
  }
  

// signout 
exports.signOut=(req,res)=>{
    res.clearCookie('myCookie')
    res.json({message:'signout success'})
}