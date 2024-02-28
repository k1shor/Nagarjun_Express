const mongoose = require('mongoose')

const programSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true
  }  
},{timestamps: true})

module.exports = mongoose.model("Program", programSchema)