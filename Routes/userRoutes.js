const express = require('express')
const router = express.Router()
const userController = require('./../Controllers/userControllers')
const userauthController = require('./../Controllers/userauthControler')
const getProfInfo = require('./../Middleware/professor')
const getuserinfo = require('./../Middleware/uerinfo')

router.post('/signup',userauthController.signup)
router.post('/login',userauthController.login)
router.post('/email',userauthController.sendotp)
router.get('/getuserinfo/:id',userauthController.getAUserinfo)
router.post('/resetpassword/:token',userauthController.resetPassword)
router.post('/forgotpassword',userauthController.forgotPassword)
router.patch('/updatepassword',userauthController.updatePassword)
router.post('/:rollno/requestproject/:projectID',getuserinfo,userController.requestProject)
router.get('/projectinfo/:projectid',userController.getProjectInfo)    

module.exports = router
