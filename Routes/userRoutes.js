const express = require('express')
const router = express.Router()
const userController = require('./../Controllers/userControllers')
const userauthController = require('./../Controllers/userauthControler')
const getProfInfo = require('./../Middleware/professor')
const getuserinfo = require('./../Middleware/uerinfo')

router.post('/signup',userauthController.signup)
router.post('/login',userauthController.login)
router.post('/email',userauthController.sendotp)

router.post('/resetPassword/:token',userauthController.resetPassword)
router.post('/forgotPassowrd',userauthController.forgotPassword)
router.patch('/updatePassword',userauthController.updatePassword)

// router
    // .route('/')
    // .post(userController.createUser)

router
    .route('/:rollno/requestproject/:projectID')
    .post(getuserinfo,userController.requestProject)
    
module.exports = router