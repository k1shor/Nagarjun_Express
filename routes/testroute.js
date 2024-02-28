const express = require('express')
const { testfunction } = require('../controller/testcontroller')
const router = express.Router()


router.get('/test', testfunction )


module.exports = router