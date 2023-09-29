import express from 'express';
import Project from '../Models/projectModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdminOrSelf } from '../util.js';
import User from '../Models/userModel.js';

const projectRouter = express.Router();

projectRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const project = await Project.find();
      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

projectRouter.post(
  '/',
  isAuth,
  //isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      //const user = await User.find();
      const newProject = new Project({
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        projectManager: req.body.projectManager,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        projectStatus: req.body.projectStatus,
        projectOwner: req.user._id,
      });

      const project = await newProject.save();

      res.status(201).json({ message: 'Project Created', project });
    } catch (error) {
      res.status(500).json({ message: 'Error creating project', error });
    }
  })
);

projectRouter.delete(
  '/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      res.status(200).json('Project has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  })
);

projectRouter.put(
  '/update/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      await project.updateOne({ $set: req.body });
      res.status(200).json('update successfully');
    } catch (err) {
      res.status(500).json({
        message: 'Something went wrong, please try again',
        error: err,
      });
    }
  })
);

export default projectRouter;
