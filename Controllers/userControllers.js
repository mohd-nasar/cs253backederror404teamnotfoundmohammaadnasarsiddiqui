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


const requestProject = catchAsync(async (req, res, next) => {
    const selectedproject = await projectModel.Project.findById(req.params.projectID);
    console.log(selectedproject);
    const logginedstudent = req.logginedstudent;
    console.log(logginedstudent);

    if (logginedstudent.projectsRequested.includes(selectedproject._id)) {
        return res.status(400).json({
            message: "Request pending for this project"
        });
    }
    if (logginedstudent.projectsEnrolled.includes(selectedproject._id)) {
        return res.status(400).json({
            message: "Already Enrolled for this project"
        });
    }
    if (logginedstudent.projectsRejected.includes(selectedproject._id)) {
        return res.status(400).json({
            message: "This project is rejected by professor"
        });
    }

    // Check if the student has already requested this project
    if (selectedproject.studentsRequested.includes(logginedstudent._id)) {
        return res.status(400).json({
            message: "You have already requested this project"
        });
    }

    logginedstudent.projectsRequested.push(selectedproject._id);
    selectedproject.studentsRequested.push(logginedstudent._id);

    await userModel.User.findByIdAndUpdate(logginedstudent._id, {
        $set: { projectsRequested: logginedstudent.projectsRequested }
    });

    await selectedproject.save();

    res.status(201).json({
        message: "Successfully requested"
    });
});


const getProjectInfo =  catchAsync(async(req,res,next)=>{
    const project = await projectModel.Project.findById(req.params.projectid)
    res.status(201).json({
        message : "success",
        project
    })
})

module.exports = {createUser,requestProject, getProjectInfo}