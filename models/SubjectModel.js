const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const subjectSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    subject_code: {
        type: String, 
        required: true
    },
    program: {
        type: ObjectId,
        ref: 'Program',
        required: true
    },
    credit: {
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Subject", subjectSchema)