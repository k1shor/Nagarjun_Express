const express = require('express')
require('dotenv').config()
require('./Database/connection')
const TestRoute = require('./routes/testroute')
const ProgramRoute = require('./routes/ProgramRoutes')
const SubjectRoute = require('./routes/SubjectRoute')
const StudentRoute = require('./routes/StudentRoute')

const app = express()
const port = process.env.PORT

// middleware
app.use(express.json())


app.use(TestRoute)
app.use(ProgramRoute)
app.use(SubjectRoute)
app.use('/student',StudentRoute)
app.use('/public/uploads',express.static('public/uploads'))


app.listen(port, ()=>{
    console.log(`Server started successfully at port ${port}`)
})