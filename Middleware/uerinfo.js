const userModel = require('./../Models/usermodels')

const getuserinfo = async(req,res,next)=>{
    const logginedstudent = await userModel.User.findOne({rollno:req.params.rollno})
    req.logginedstudent = logginedstudent
    console.log(req.logginedstudent)
    next()
}
module.exports = getuserinfo