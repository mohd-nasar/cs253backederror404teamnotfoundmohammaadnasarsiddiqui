const mongoose = require('mongoose')
const profModel = require('./proffesors')

const projectSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    desciption : {
        type: String, 
        required : true  
    },
    prereg : {
        type : [String]
    },
    openfor:{
        type: Number
    },
    resumerequired : {
        type : bool,
        required : true
    },
    maxstudents : {
        type : Number,
        required : true
    },
    cpirequired : {
        type : Number
    },
    projectCategory : {
         type  : String
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
