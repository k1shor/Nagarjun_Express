const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const StudentSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    first_name: {
        type: String, 
        required: true
    },
    last_name: {
        type: String, 
        required: true
    },
    gender:{
        type: String,
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
    },
    image:{
        type: String,
        // required: true
    }
})

module.exports = mongoose.model("Student", StudentSchema)