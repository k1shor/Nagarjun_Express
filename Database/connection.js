const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log("Database conencted successfully")
})
.catch(error=>console.log(error))