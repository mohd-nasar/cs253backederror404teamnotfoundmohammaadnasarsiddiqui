const projectModel = require('./../Models/projects')
const profModel = require('./../Models/proffesors')
const userModel = require('./../Models/usermodels')
const catchAsync = require('../utils/catchAsync')


const createProject = catchAsync(async (req, res,next) => {
    const selectedprof = await req.selectedprof
    console.log(selectedprof)
    const newProject = await projectModel.Project.create({
        name: req.body.name,
        description : req.body.description,
        prereg : req.body.prereg,
        openfor : req.body.openfor,
        resumerequired : req.body.resumerequired ,
        maxstudents : req.body.maxstudents,
        cpirequired : req.body.cpirequired,
        projectCategory : req.body.projectCategory,
        offeredByProf : selectedprof._id
    })
    selectedprof.projects.push(newProject._id.toString())
    await profModel.prof.findByIdAndUpdate(selectedprof._id, {
            $set: { projects: selectedprof.projects }
        })
    console.log(selectedprof.projects);
    res.status(201).json(newProject)
})

const approveproject = catchAsync(async(req,res,next)=>{
    // const selectedprof =  await req.selectedprof
    const selectedstudent = await userModel.User.findOne({rollno:req.params.rollno})
    const selectedproject = await req.selectedproject
    if (selectedstudent._id in selectedproject.studentsRequested){
        selectedproject.studentsRequested = selectedproject.studentsRequested.filter(item => !item.equals(selectedstudent._id))
        selectedproject.studentsEnrolled.push(selectedstudent._id)
        await projectModel.Project.findByIdAndUpdate(selectedproject._id,{
            $set : {
                studentsEnrolled : selectedproject.studentsEnrolled, 
                studentsRequested : selectedproject.studentsRequested    
            }
        })
        res.status(201).json({
            status : "success",
            message : "Requested Approved"
        })
    }
    res.status(500).json({
        status : "fail",
        message : "the student not requested for this project"
    })
    
    // console.log(selectedstudent._id)
        
})

const rejectproject = catchAsync(async(req,res,next)=>{
    const selectedstudent = await userModel.User.findOne({rollno:req.params.rollno})
    const selectedproject = await req.selectedproject
    if (selectedstudent._id in selectedproject.studentsRequested){
        selectedproject.studentsRequested = selectedproject.studentsRequested.filter(item => !item.equals(selectedstudent._id))
        // selectedproject.studentsEnrolled.push(selectedstudent._id)
        await projectModel.Project.findByIdAndUpdate(selectedproject._id,{
            $set : {
                // studentsEnrolled : selectedproject.studentsEnrolled, 
                studentsRequested : selectedproject.studentsRequested    
            }
        })
        res.status(201).json({
            status : "success",
            message : "Students removed"
        })
    }
    res.status(500).json({
        status : "fail",
        message : "the student not requested for this project"
    })
        
    // console.log(selectedstudent._id)
        
})

const deleteproject = catchAsync(async(req,res,next)=>{
    const deletedProject = await projectModel.Project.findByIdAndDelete(req.params.projectid);
        
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Respond with a success message
        return res.status(201).json({ message: "Project deleted successfully", deletedProject });
})

module.exports = { createProject, approveproject,rejectproject, deleteproject }