const profModel = require('./../Models/proffesors')


const getProfInfo = async (req,res,next)=>{
    const profuniqueid = req.params.uniqueID
    const selectedprof = await profModel.prof.findOne({uniqueID : profuniqueid})
    req.selectedprof = selectedprof
    console.log(selectedprof)
    next()
}
module.exports = getProfInfo