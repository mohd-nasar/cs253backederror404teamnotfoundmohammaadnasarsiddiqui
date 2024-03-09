const express = require('express')
const profController = require('./../Controllers/projectController')

const { prof } = require('../Models/proffesors')

const router = express.Router()

router
    .route('/')
    .post(profController.createProject)

module.exports = router