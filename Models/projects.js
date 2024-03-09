const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
   
    name:{
        type : String,
        
    },
    desciption : {
        type: String,
        
    },
    offeredByProf : {
        type : Object
    },
    studentsEnrolled : {
        type: [Object]
    },
    studentsRequested : {
        type: [Object]
    }
})

const Project = new mongoose.model('Project',projectSchema)

module.exports = {Project}
