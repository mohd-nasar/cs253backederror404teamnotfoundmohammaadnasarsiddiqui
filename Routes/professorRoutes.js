const express = require('express')
const profController = require('./../Controllers/projectController')
const userauthControler = require('./../Controllers/userauthControler')
const getprojectInfo = require('./../Middleware/projectInfo')
const getprofInfo = require('./../Middleware/professor')

// const { prof } = require('../Models/proffesors')
// const { useRouteLoaderData } = require('react-router-dom')

const router = express.Router()

router 
   .route('/login')
   .post(userauthControler.proflogin)

router
    .route('/:uniqueID/createproject')
    .post(getprofInfo,profController.createProject)

router
    .route('deleteproject/:projectid')
    .delete(profController.deleteproject)    

router
    .route('/approveproject/:projectid/:rollno')  
    .get(getprojectInfo,profController.approveproject) 

router
    .route('/rejectproject/:projectid/:rollno')
    .get(getprojectInfo,profController.rejectproject)    

module.exports = router

//everthing is not up to date please push the req git comeoon



