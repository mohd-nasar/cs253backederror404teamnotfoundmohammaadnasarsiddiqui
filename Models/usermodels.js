const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        requied: true
    },
    rollno : {
        type : Number,
        required : true,
        unique : false   
    },
    email : {
        type: String,
        required : true,
        unique: false,
        lowercase : true,
        validator : validator.isEmail
    },
    department : {
        type : String,
        requied : true,
        select : false
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    confirmpassword : {
        type : String,
        required : true,
        validate : {
            //this works on create and on save
            validator : function(el){
                return el === this.password
            }
        }

    },
    projectsEnrolled : {
        type : [Object]
    },
    projectsRequested : {
        type : [Object]
    }
})


//don't work on find only works on save and creATE
userSchema.pre('save',async function(next){
    if(!this.modifiedPaths('password')) return next()

    this.password = await bcryptjs.hash(this.password,12)
    this.confirmpassword = undefined
    next()
})

userSchema.methods.checkPassword = async function(enteredpass,userpass){
    return await bcryptjs.compare(enteredpass,userpass)
}

const User = mongoose.model('User',userSchema)

module.exports = {User}