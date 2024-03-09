const util = require('util')
const userModel = require('./../Models/usermodels')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const catchAsync = require('../utils/catchAsync')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const signup = catchAsync(async (req, res, next) => {

    const newUser = await userModel.User.create(req.body)
    const token = signToken(newUser._id)

    console.log(newUser)
    res.status(201).json({
        status: "success",
        token,
        data: newUser
    })
    
})

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new AppError('Incorrect Email and/or Password .New User? Signin', 404))
    }
    const user = await userModel.User.findOne({ email }).select("+password -__v")
    console.log(user)
    if (!user || !(await user.checkPassword(password, user.password))) {
       return next(new AppError('Incorrect email and/or password , Try SignIN?',400))
    }
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token,
        user
    })
    
})

const protect = catchAsync(async(req,res,next)=>{
    let token
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1]
        console.log(token)
    }
    if(!token){
        return next(new AppError('Please login to access this page',401))
    }
    
    const decoded = await util.promisify(jwt.verify)(token,process.env.JWT_SECRET)
    console.log(decoded)
    next()
})

module.exports = { signup, login ,protect}