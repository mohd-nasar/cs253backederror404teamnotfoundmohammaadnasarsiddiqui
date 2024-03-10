const express = require('express')
const facultyController = require('./../Controllers/facultyController')
const userauthController = require('./../Controllers/userauthControler')

const router = express.Router()

router 
    .route('/')
    .get(facultyController.getAllFaculty)
    
router 
    .route('/:uniqueID')
    .get(facultyController.getprofInfo)    

        

module.exports = router;    