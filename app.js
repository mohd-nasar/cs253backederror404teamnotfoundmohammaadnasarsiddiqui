const mongoose = require('mongoose')
const morgan = require('morgan')
const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const facultyRoutes = require('./Routes/facultyRoutes')
const userRoutes = require('./Routes/userRoutes')
const professorRoutes = require('./Routes/professorRoutes')
const getProfInfo = require('./Middleware/professor')
const AppError = require('./utils/appError')
const errorHandler = require('./Controllers/errorController')
const cors = require ('cors')


app = express()
app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }


const DB = process.env.MONGODB_ATLAS_CONN_STR
mongoose.connect(DB)
    .then(con=>{
        console.log("connected to mongoDB")
    })
    .catch(err => {
        console.log(`error connecting to db ${err}`)
    })

app.get('/',(req,res)=>{
    res.status(200).json({
        message: "Apis is hosted and working , fronetend banao jaldi,"
    })
})
app.use('/api/user',userRoutes)
app.use('/api/user/faculty',facultyRoutes)
app.use('/api/professor',professorRoutes) 
// app.use('/api/professor/:uniqueID',getProfInfo) //Middleware 
// app.use('/api/professor/:uniqueID/createproject',professorRoutes)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})
app.use(errorHandler)


const port = process.env.port    
app.listen(port,()=>{
    console.log(`App running on http://localhost:${port}`)
})

const app = {
    console.log("Eating 5  star and do nothing !!!")
}