const projectModel = require('./../Models/projects')
const profModel = require('./../Models/proffesors')
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

module.exports = { createProject }