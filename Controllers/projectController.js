const projectModel = require('./../Models/projects')
const profModel = require('./../Models/proffesors')
const userModel = require('./../Models/usermodels')
const catchAsync = require('../utils/catchAsync')


const createProject = catchAsync(async (req, res,next) => {
    const selectedprof = await req.selectedprof
    const offeredByProf = {
        name : selectedprof.name,
        department : selectedprof.department,
        email : selectedprof.email,
        contact : selectedprof.contact,
        address : selectedprof.address,
        porfid : selectedprof._id
    }
    const newProject = await projectModel.Project.create({
        name: req.body.name,
        description : req.body.description,
        prereg : req.body.prereg,
        openfor : req.body.openfor,
        resumerequired : req.body.resumerequired ,
        maxstudents : req.body.maxstudents,
        cpirequired : req.body.cpirequired,
        projectCategory : req.body.projectCategory,
        offeredByProf
    })

    selectedprof.projects.push(newProject._id)
    await profModel.prof.findByIdAndUpdate(selectedprof._id, {
            $set: { projects: selectedprof.projects }
        })
    console.log(selectedprof.projects);
    res.status(201).json(newProject)
})

// const approveproject = catchAsync(async(req,res,next)=>{
//     const selectedstudent = await userModel.User.findOne({rollno:req.params.rollno})
//     const selectedproject = await req.selectedproject
//     if (selectedstudent._id in selectedproject.studentsRequested){
//         selectedproject.studentsRequested = selectedproject.studentsRequested.filter(item => !item.equals(selectedstudent._id))
//         selectedproject.studentsEnrolled.push(selectedstudent._id)
//         await projectModel.Project.findByIdAndUpdate(selectedproject._id,{
//             $set : {
//                 studentsEnrolled : selectedproject.studentsEnrolled, 
//                 studentsRequested : selectedproject.studentsRequested    
//             }
//         })
//         res.status(201).json({
//             status : "success",
//             message : "Requested Approved"
//         })
//     }
//     res.status(500).json({
//         status : "fail",
//         message : "the student not requested for this project"
//     })  
// })
const approveproject = catchAsync(async(req, res, next) => {
    // const selectedprof =  await req.selectedprof
    const selectedstudent = await userModel.User.findOne({ rollno: req.params.rollno });
    const projectid = req.params.projectid;
    const selectedproject = await projectModel.Project.findById(projectid);
    
    console.log(req.params.projectid);
    
    selectedproject.studentsRequested = selectedproject.studentsRequested.filter(item => !item.equals(selectedstudent._id));
    selectedproject.studentsEnrolled.push(selectedstudent._id);
    selectedstudent.projectsRequested = selectedstudent.projectsRequested.filter(item => !item.equals(selectedproject._id));
    selectedstudent.projectsEnrolled.push(selectedproject._id);
    
    await projectModel.Project.findByIdAndUpdate(selectedproject._id, {
      $set: {
        studentsEnrolled: selectedproject.studentsEnrolled,
        studentsRequested: selectedproject.studentsRequested,
      },
    });
    
    await userModel.User.findByIdAndUpdate(selectedstudent._id, {
      $set: {
        projectsEnrolled: selectedstudent.projectsEnrolled,
        projectsRequested: selectedstudent.projectsRequested,
      },
    });
    
    // Handle the response based on the condition
    if (selectedproject.studentsEnrolled.includes(selectedstudent._id)) {
      res.status(201).json({
        status: "success",
        message: "Request Approved",
      });
    } else {
      res.status(500).json({
        status: "fail",
        message: "The student did not request for this project",
      });
    }
});


// const rejectproject = catchAsync(async(req,res,next)=>{
//     const selectedstudent = await userModel.User.findOne({rollno:req.params.rollno})
//     const selectedproject = await req.selectedproject
//     if (selectedstudent._id in selectedproject.studentsRequested){
//         selectedproject.studentsRequested = selectedproject.studentsRequested.filter(item => !item.equals(selectedstudent._id))
//         selectedstudent.projectsRejected.push(selectedproject._id)
//         // await selectedstudent.save()
//         await userModel.User.findByIdAndUpdate(selectedstudent._id,{
//             $set : { 
//                 projectsRejected : selectedstudent.projectsRejected    
//             }
//         })
//         await projectModel.Project.findByIdAndUpdate(selectedproject._id,{
//             $set : {
//                 studentsRequested : selectedproject.studentsRequested    
//             }
//         })
//         res.status(201).json({
//             status : "success",
//             message : "Students removed"
//         })
//     }
//     res.status(500).json({
//         status : "fail",
//         message : "the student not requested for this project"
//     })   
// })

const rejectProject = catchAsync(async (req, res, next) => {
    const selectedStudent = await userModel.User.findOne({ rollno: req.params.rollno });

    const projectId = req.params.projectid;
    const selectedProject = await projectModel.Project.findById(projectId);

    selectedProject.studentsRequested = selectedProject.studentsRequested.filter(item => !item.equals(selectedStudent._id));
    selectedStudent.projectsRequested = selectedStudent.projectsRequested.filter(item => !item.equals(selectedProject._id));
    selectedStudent.projectsRejected.push(selectedProject._id);

    await projectModel.Project.findByIdAndUpdate(selectedProject._id, {
        $set: {
            studentsRequested: selectedProject.studentsRequested    
        }
    });

    await userModel.User.findByIdAndUpdate(selectedStudent._id, {
        $set: {
            projectsRequested: selectedStudent.projectsRequested,
            projectsRejected: selectedStudent.projectsRejected,
        }
    });

    if (!selectedProject.studentsRequested.includes(selectedStudent._id) && selectedStudent.projectsRejected.includes(selectedProject._id)) {
        res.status(201).json({
            status: "success",
            message: "Request Rejected!",
        });
    } else {
        res.status(500).json({
            status: "fail",
            message: "The student did not request for this project",
        });
    }
});


const deleteproject = catchAsync(async(req,res,next)=>{
    const deletedProject = await projectModel.Project.findByIdAndDelete(req.params.projectid);  
    if (!deletedProject) {
        return res.status(404).json({ message: "Project not found" });
    }
    return res.status(201).json({ message: "Project deleted successfully", deletedProject });
})

module.exports = { createProject, approveproject,rejectproject, deleteproject }
