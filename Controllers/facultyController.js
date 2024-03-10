const profmodel = require('./../Models/proffesors')
const catchAsync = require('./../utils/catchAsync')
const apiFeatures = require('./../utils/ApiFeatures')
const appError = require('./../utils/appError')

const getAllFaculty = catchAsync(async (req, res, next) => {

    const features = new apiFeatures(profmodel.prof.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const prof = await features.query;

    res.status(200).json(prof);
})

const getprofInfo = catchAsync(async(req,res,next)=>{
    const uniqueID = req.params.uniqueID
    const prof = await profmodel.prof.findOne({uniqueID})
    res.status(200).json(prof)
})

module.exports = { getAllFaculty , getprofInfo}
