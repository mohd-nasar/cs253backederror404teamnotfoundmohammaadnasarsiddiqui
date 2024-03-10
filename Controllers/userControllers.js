const userModel = require('./../Models/usermodels')
const projectModel = require('./../Models/projects')
const catchAsync = require('../utils/catchAsync')

const createUser = async (req, res) => {
    try {
        // const profuniqueid = req.params.uniqueID
        // console.log(profuniqueid)
        // const newUser = await userModel.User.create(req.body)
        // res.status(201).json({
        //     status: "successfully created",
        //     user: newUser
        // })
        //as of now creating user in authcontroller.js
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            status: "fail",
            message : "internal server error"
        })
    }    
}


const requestProject = catchAsync(async (req,res,next)=>{
    //used the middleware userinfo.js
    const selectedproject = await projectModel.Project.findById(req.params.projectID)
    const logginedstudent = req.logginedstudent
    logginedstudent.projectsRequested.push(selectedproject._id)
    selectedproject.studentsRequested.push(logginedstudent._id)
    await userModel.User.findByIdAndUpdate(logginedstudent._id, {
        $set: { projectsRequested: logginedstudent.projectsRequested.map(String) }
    });
    await selectedproject.save()
    res.status(201).json({
        message: "Successfully requested"
    })
})  

module.exports = {createUser,requestProject}