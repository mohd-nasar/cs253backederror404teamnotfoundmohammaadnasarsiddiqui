const util = require('util')
const userModel = require('./../Models/usermodels')
const profModel = require('./../Models/proffesors')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const catchAsync = require('../utils/catchAsync')
const sendEmail = require('./../utils/email')
const crypto = require('crypto')
const { reset } = require('nodemon')
// const { createSearchParams } = require('react-router-dom')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
  
    res.cookie('jwt', token, cookieOptions)
    // Remove password from output
    user.password = undefined
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    })
  }

const signup = catchAsync(async (req, res, next) => {
    if(await userModel.User.findOne({email : req.body.email})){
      res.status(401).json({
        message : "signup Fail, Email already in use",
      })
    }
    const newUser = await userModel.User.create(req.body)
    createSendToken(newUser,201,res)   
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
    createSendToken(user,200,res)
    
})

const proflogin = catchAsync(async (req, res, next) => {
    const { email} = req.body
    console.log(email)
    if (!email) {
        return next(new AppError('Incorrect Email .New Prof ? ask admin to sign you up', 404))
    }
    const prof = await profModel.prof.findOne({ email })
    console.log(prof)
    if (!prof) {
       return next(new AppError('Incorrect email and/or password , Try SignIN?',400))
    }
    createSendToken(prof,200,res)
})

//a middleware function
const protect = catchAsync(async(req,res,next)=>{
    let token
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError('Please login to access this page',401)) //401 not authorized
    }
    
    const decoded = await util.promisify(jwt.verify)(token,process.env.JWT_SECRET)
    const freshUser = await userModel.User.findById(decoded.id)
    if(!freshUser){
        return next(new AppError('The user belogning to the token no longer exists',401))
    }
    if(freshUser.changedpasswordafter(decoded.iat)){
        return next(
            new AppError('Password changed ! Login again')
        )
    } 
    next()
})

const forgotPassword = catchAsync(async (req,res,next)=>{
    const user = await userModel.User.findOne({email:req.body.email})
    console.log(user)
    if(!user){
        return next(new AppError('User with this email not found',404))
    }
    const resetToken = user.createPasswordResetToken()

    console.log("token saved to database is ")
    console.log(resetToken)
    await userModel.User.findOneAndUpdate(
      { email: req.body.email },
      {
        passwordResetToken: resetToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      }// Return the updated document
    )

    const resetURL = `https://profinfocentral.vercel.app/resetpassword/${resetToken}`;

  const message = `Visit this url for changing the password \n ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      resetToken
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }  
})



const resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex')
  
    const user = await userModel.User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() }
    })
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400))
    }
    user.password = req.body.password
    user.confirmpassword = req.body.confirmpassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined;
    await user.save()

    createSendToken(user,200,res)
  })
  
const updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await userModel.User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTed current password is correct
    if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // 3) If so, update password
    user.password = req.body.password;
    user.confirmpassword = req.body.confirmpassword;
    await user.save()
    createSendToken(user,200,res)
  });

const sendotp = catchAsync(async (req,res,next)=>{
  const otpValue = Math.floor(100000 + Math.random() * 900000)
  try{
    await sendEmail({
      email: req.body.email,
      subject: 'OTP for centralized project Integration signup',
      message : `Enter the otp to signup in Centralised Project Integration ${otpValue}`

    });
    res.status(201).json({
      message : "success",
      otp : `${otpValue}`
    })
  }catch{
    res.status(404).json({
      meassge : "Email not send "
    })
  }

})
const getAUserinfo = catchAsync (async (req,res,next)=>{
     const userid =  req.params.id
    const user = await userModel.User.findById(userid)
    res.status(201).json({
      message : 'success',
      user
    })
})

module.exports = { 
   signup, 
   login ,
   protect,
   proflogin, 
   forgotPassword, 
   resetPassword, 
   updatePassword, 
   sendotp,
   getAUserinfo
  }