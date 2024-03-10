const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User"
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires : 82400
    }  
})

module.exports = mongoose.model("Token", TokenSchema)