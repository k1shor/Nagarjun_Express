const { validationResult, check } = require('express-validator')

const ProgramRules = [
    check('title', "Program Title is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Program title must be at least 3 characters")
]

const SubjectRules = [
    check('title', "Subject Title is required").notEmpty()
        .isLength({ min: 5 }).withMessage("Subject title must be at least 5 characters")
]

const StudentRules = [
    check('username', "Username is required").notEmpty()
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username must consist of alphabets, numbers and underscore only")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

    check('first_name', "First name is required").notEmpty()
        .matches(/^[a-zA-Z]+$/).withMessage("First name must be only alphabets")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

    check('last_name', "First name is required").notEmpty()
        .matches(/^[a-zA-Z]+$/).withMessage("Last name must be only alphabets")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

    check('email', "Email is required").notEmpty()
        .isEmail().withMessage("Email format incorrect"),

    check('password', "Password is required").notEmpty()
        .matches(/[a-z]/).withMessage("password must contain at least one lowercase alphabet")
        .matches(/[A-Z]/).withMessage("password must contain at least one uppercase alphabet")
        .matches(/[0-9]/).withMessage("password must contain at least one number")
        .matches(/[!@#$%^&*+/\-]/).withMessage("password must contain at least one special character")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .isLength({ max: 30 }).withMessage("Password must be at least 30 characters"),


    check('gender', "Gender is required").notEmpty()
        .isIn(['male','female']).withMessage("Gender must be male or female only")

]

const validationFunction = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        next()
    }
    else {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
}

module.exports = { ProgramRules, validationFunction, SubjectRules, StudentRules }