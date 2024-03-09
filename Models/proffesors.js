//professors schema when then users will visit /faculty

const mongoose = require('mongoose')

const profSchema = new mongoose.Schema({
    uniqueID : String,
    name : String,
    designation:String,
    department:String,
    emai:String,
    contact:String,
    address:String,
    research:[String],
    projects : [Object]
})

const prof = mongoose.model('prof',profSchema)
module.exports = {prof}