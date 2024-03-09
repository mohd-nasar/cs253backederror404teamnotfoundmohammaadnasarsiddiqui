const express = require('express')
const facultyController = require('./../Controllers/facultyController')
const userauthController = require('./../Controllers/userauthControler')

const router = express.Router()

router 
    .route('/')
    .get(userauthController.protect,facultyController.getAllFaculty)
    

module.exports = router;    