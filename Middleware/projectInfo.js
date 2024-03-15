const projectModel = require('./../Models/projects')
const catchAsync = require('./../utils/catchAsync')

const getprojectsinfo = catchAsync (async(req,res,next)=>{
    const projectid = req.params.projectid
    const selectedproject = await projectModel.Project.findById(projectid)
    // console.log(selectedproject)
    req.selectedproject = selectedproject
    next();
})    

module.exports = getprojectsinfo