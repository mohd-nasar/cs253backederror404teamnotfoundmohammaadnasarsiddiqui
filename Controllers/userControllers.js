const userModel = require('./../Models/usermodels')
const projectModel = require('./../Models/projects')

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

const requestProject = async (req,res)=>{
    // const requestedprojectid = req.params.projectid
    // const requestedproject = projectModel.Project.find({_id : requestedprojectid})
    //MIddleware use karo user lao project lao aur fir dono ki list me changes karo
}  

module.exports = {createUser,requestProject}