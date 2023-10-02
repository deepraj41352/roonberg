import express from 'express';
import Project from '../Models/projectModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdminOrSelf, sendEmailNotify } from '../util.js';
import User from '../Models/userModel.js';
import Conversation from '../Models/conversationModel.js';

const projectRouter = express.Router();

projectRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      // Check user's role and determine which projects to retrieve
      const userRole = req.user.role; // Replace with the actual way you get the user's role

      if (userRole === 'admin' || userRole === 'superadmin') {
        // Admin and superadmin can access all projects
        const projects = await Project.find();
        res.json(projects);
      } else if (userRole === 'contractor') {
        // Contractors can only access their own projects
        const contractorId = req.user._id; // Replace with the actual way you identify the contractor
        const projects = await Project.find({ projectOwner: contractorId });
        res.json(projects);
      } else if (userRole === 'agent') {
        // Contractors can only access their own projects
        const agentId = req.user._id; // Replace with the actual way you identify the contractor
        const projects = await Project.find({ assignedAgent: agentId });
        res.json(projects);
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

projectRouter.post(
  '/admin/addproject',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const userRole = req.user.role;
      const contractorId = req.body.contractorId;
      const agentId = req.body.agentId;
      const aget = await User.findById(agentId, 'first_name email');
      const user = await User.findById(contractorId, 'first_name email');
      if (userRole === 'admin' || userRole === 'superadmin') {
        const newProject = new Project({
          projectName: req.body.projectName,
          projectDescription: req.body.projectDescription,
          projectCategory: req.body.projectCategory,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          projectStatus: req.body.projectStatus,
          projectOwner: contractorId,
          assignedAgent: agentId,
        });
        const project = await newProject.save();
        const toEmails = `${user.email},${aget.email}`;
        const options = {
          to: toEmails,
          subject: 'New Project Create✔',
          template: 'CREATE-PROJECT',
          projectName: req.body.projectName,
          projectDescription: req.body.projectDescription,
          user,
        };
        await sendEmailNotify(options);

        if (project.assignedAgent) {
          const newConversation = new Conversation({
            members: [project.assignedAgent, project.projectOwner],
          });
          await newConversation.save();
        }

        res.status(201).json({ message: 'Project Created', project });
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

projectRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      //const user = await User.find();
      const newProject = new Project({
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        projectCategory: req.body.projectCategory,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        projectStatus: req.body.projectStatus,
        projectOwner: req.user._id,
      });
      const project = await newProject.save();
      const adminEmails = await User.find({ role: 'admin' }, 'email');
      const emails = adminEmails.map((user) => user.email);
      const user = await User.findById(req.user._id, 'first_name email');
      const options = {
        to: emails.toString(),
        subject: 'New Project Create✔',
        template: 'CREATE-PROJECT',
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        user,
      };
      await sendEmailNotify(options);
      res.status(201).json({ message: 'Project Created', project });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating project', error });
    }
  })
);

projectRouter.post(
  '/assign-project/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const projectId = req.params.id;
      const agentId = req.body.agentId;
      const user = await User.findById(agentId, 'first_name email');
      const updatedProject = await Project.findByIdAndUpdate(projectId, {
        assignedAgent: agentId,
      });
      const options = {
        to: user.email,
        subject: 'New Project Create ✔',
        template: 'CREATE-PROJECT',
        projectName: updatedProject.projectName,
        projectDescription: updatedProject.projectDescription,
        user,
      };
      await sendEmailNotify(options);
      if (updatedProject.assignedAgent) {
        const newConversation = new Conversation({
          members: [updatedProject.assignedAgent, updatedProject.projectOwner],
        });
        await newConversation.save();
      }
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error('Error assigning the project:', error);
      res.status(500).json({ error: 'Error assigning the project' });
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
projectRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        res.status(400).json({ message: 'Project not found' });
      }
      const conversions = await Conversation.find({ projectId: req.params.id });
      const { ...other } = project._doc;
      res.json({ ...other, conversions: conversions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);
export default projectRouter;
