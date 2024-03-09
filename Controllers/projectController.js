const projectModel = require('./../Models/projects')
const profModel = require('./../Models/proffesors')


const createProject = async (req, res) => {
    try {
        const newProject = await projectModel.Project.create(req.body)
        const { selectedprof } = req
        selectedprof.projects.push(newProject._id.toString())
        await profModel.prof.findByIdAndUpdate(selectedprof._id, {
                $set: { projects: selectedprof.projects }
            })
        console.log(selectedprof.projects);
        res.status(201).json(newProject)
    }


    catch (err) {
        console.log(`error creating project ${err}`)
    }
}

module.exports = { createProject }