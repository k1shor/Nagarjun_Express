const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const StudentSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    program: {
        type: ObjectId,
        ref: "Program",
        required: true
    },
    semester: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Student", StudentSchema)