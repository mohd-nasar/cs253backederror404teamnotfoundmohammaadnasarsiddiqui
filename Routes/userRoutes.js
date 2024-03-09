const express = require('express')
const router = express.Router()
const userController = require('./../Controllers/userControllers')
const userauthController = require('./../Controllers/userauthControler')

router.post('/signup',userauthController.signup)
router.post('/login',userauthController.login)

router
    .route('/')
    .post(userController.createUser)

router 
    .route('/:uniqueID/requestproject/:projectid')
    .post(userController.requestProject)    

module.exports = router