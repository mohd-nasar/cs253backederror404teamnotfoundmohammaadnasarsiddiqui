const util = require('util')
const userModel = require('./../Models/usermodels')
const profModel = require('./../Models/proffesors')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const catchAsync = require('../utils/catchAsync')
const sendEmail = require('./../utils/email')
const crypto = require('crypto')
const { createSearchParams } = require('react-router-dom')


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

    const newUser = await userModel.User.create(req.body)
    // const token = signToken(newUser._id)
    // console.log(newUser)
    createSendToken(newUser,201,res)
    // res.status(201).json({
    //     status: "success",
    //     token,
    //     data: newUser
    // })
    
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
    // const token = signToken(user._id)
    // res.status(200).json({
    //     status: 'success',
    //     token,
    //     user
    // })
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
    // const token = signToken(user._id)
    // res.status(200).json({
    //     status: 'success',
    //     token,
    //     prof
    // })
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
    const user = userModel.User.findOne({email:req.body.email})
    if(!user){
        return next(new AppError('User with this email not found',404))
    }
    const resetToken = createPasswordResetToken()
    await user.save({validateBeforeSave : false})
    const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
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
      .digest('hex');
  
    const user = await userModel.User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmpassword = req.body.confirmpassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // const token = signToken(user._id)
    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
    createSendToken(user,200,res)
  });
  
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
  
    // 4) Log user in, send JWT
    // const token = signToken(user._id)
    // res.status(200).json({
    //     status: 'success',
    //     token
    // })
    createSendToken(user,200,res)
  });

const sendotp = catchAsync(async (req,res,next)=>{
  const otpValue = Math.floor(100000 + Math.random() * 900000)
  try{
    await sendEmail({
      email: req.body.email,
      subject: 'OTP for centralized project Integration signup',
      message : `Hello i am Mohd Nasar Siddiqui , director of Centralised Project Integration ,Your otp for signup is ${otpValue}`

    });
    res.status(800).json({
      message : "success",
      otp : `${otpValue}`
    })
  }catch{
    res.status(801).json({
      meassge : "Email not send "
    })
  }

})

module.exports = { 
   signup, 
   login ,
   protect,
   proflogin, 
   forgotPassword, 
   resetPassword, 
   updatePassword, 
   sendotp
  }