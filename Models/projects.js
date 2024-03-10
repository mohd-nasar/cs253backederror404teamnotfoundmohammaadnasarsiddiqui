const mongoose = require('mongoose')
const profModel = require('./proffesors')

const projectSchema = new mongoose.Schema({
    name:{
        type : String,
    },
    desciption : {
        type: String,  
    },
    offeredByProf : {
        type : mongoose.Schema.ObjectId,
        ref: 'profs'
    },
    studentsEnrolled : {
        type: [
            {
                type : mongoose.Schema.ObjectId,
                ref : 'users'
            }
        ]
    },
    studentsRequested : [
        {
            type: mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]
})




const Project = new mongoose.model('Project',projectSchema)

module.exports = {Project}
