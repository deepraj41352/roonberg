import express from 'express';
import { isAuth, sendEmailNotify } from '../util.js';
import expressAsyncHandler from 'express-async-handler';
import projectTask from '../Models/projectTaskModel.js';
import Task from '../Models/taskModel.js';
import Category from '../Models/categoryModel.js';
import User from '../Models/userModel.js';
import Conversation from '../Models/conversationModel.js';

const TaskRouter = express.Router();

TaskRouter.get(
  '/project',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const projects = await projectTask.find().sort({ createdAt: -1 });
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

TaskRouter.get(
  '/tasks',
  expressAsyncHandler(async (req, res) => {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

// Addmin & superAdmin add project

TaskRouter.post(
  '/admin',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      function capitalizeFirstLetter(data) {
        return data && data.charAt(0).toUpperCase() + data.slice(1);
      }
      const contractorName = capitalizeFirstLetter(req.body.contractorName);
      const selectProjectName = capitalizeFirstLetter(
        req.body.selectProjectName
      );
      const projectName = capitalizeFirstLetter(req.body.projectName);
      const taskName = capitalizeFirstLetter(req.body.taskName);
      const taskCategory = capitalizeFirstLetter(req.body.taskCategory);
      const userRole = req.user.role;

      if (userRole === 'admin' || userRole === 'superadmin') {
        let user = await User.findOne({
          first_name: contractorName,
        });

        let selectProject = await projectTask.findOne({
          projectName: selectProjectName,
        });

        let project = await projectTask.findOne({ projectName });
        let task = await Task.findOne({ taskName });
        let category = await Category.findOne({ categoryName: taskCategory });
        let agent = await User.findOne({ agentCategory: category._id });
        if (project && project.projectName === projectName) {
          console.log('in if');
          res.status(200).json({
            message: ' A Project With The Same Name Already Exists.',
          });
        } else if (task && task.taskName === taskName) {
          res.status(200).json({
            message: 'A Task With The Same Name Already Exists.',
          });
        } else if (selectProject) {
          let userSelect = await User.findOne({
            _id: selectProject.userId,
          });
          const newTask = await new Task({
            taskName: taskName,
            projectName: selectProjectName,
            taskDescription: req.body.taskDescription,
            projectId: selectProject._id,
            taskCategory: category._id,
            userId: userSelect._id,
            agentId: agent._id,
            userName: userSelect.first_name,
            agentName: agent.first_name,
          }).save();
          console.log(newTask);
          const options = {
            to: [userSelect.email, agent.email],
            subject: 'New Task Create✔ ',
            template: 'ADDTASK-CONTRACTOR',
            projectName: selectProjectName,
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            user: userSelect,
          };
          await sendEmailNotify(options);

          const existingConversation = await Conversation.findOne({
            members: [agent._id, userSelect._id],
            projectId: selectProject._id,
            taskId: newTask._id,
          });
          console.log('existingConversation', existingConversation);
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agent._id, userSelect._id],
              projectId: selectProject._id,
              taskId: newTask._id,
            });

            await newConversation.save();
            // Use savedConversation as needed
          } else {
            res.status(500).json({ message: 'Conversation Already Exists' });
          }
          res
            .status(201)
            .json({ message: 'Task Created Successfully!!', task: newTask });
        } else {
          project = await new projectTask({
            projectName,
            userId: user._id,
            agentId: agent._id,
          }).save();

          const newTask = await new Task({
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            projectName: projectName,
            projectId: project._id,
            taskCategory: category._id,
            userId: user._id,
            agentId: agent._id,
            userName: user.first_name,
            agentName: agent.first_name,
          }).save();
          console.log(user.email, agent.email);

          const options = {
            to: [user.email, agent.email],
            subject: 'New Task Create✔ ',
            template: 'ADDTASK-CONTRACTOR',
            projectName: projectName,
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            user,
          };
          await sendEmailNotify(options);

          const existingConversation = await Conversation.findOne({
            members: [agent._id, user._id],
            projectId: project._id,
            taskId: newTask._id,
          });
          console.log('existingConversation', existingConversation);
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agent._id, user._id],
              projectId: project._id,
              taskId: newTask._id,
            });

            await newConversation.save();
          } else {
            res.status(500).json({ message: 'Conversation Already Exists' });
          }

          res
            .status(201)
            .json({ message: 'Task Created Successfully!', task: newTask });
        }
      } else {
        res.status(200).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error creating Task', error: error.message });
    }
  })
);

// Contractor add project

TaskRouter.post(
  '/contractor',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      function capitalizeFirstLetter(data) {
        return data && data.charAt(0).toUpperCase() + data.slice(1);
      }
      const user = req.user;
      const selectProjectName = capitalizeFirstLetter(
        req.body.selectProjectName
      );
      const projectName = capitalizeFirstLetter(req.body.projectName);
      const taskName = capitalizeFirstLetter(req.body.taskName);
      const taskCategory = capitalizeFirstLetter(req.body.taskCategory);
      if (user.role === 'contractor') {
        let selectProject = await projectTask.findOne({
          projectName: selectProjectName,
        });
        const adminEmails = await User.find({ role: 'admin' }, 'email');
        const superAdminEmails = await User.find(
          { role: 'superadmin' },
          'email'
        );
        const adminEmailAddresses = adminEmails.map((user) => user.email);
        const superAdminEmailAddresses = superAdminEmails.map(
          (user) => user.email
        );
        let project = await projectTask.findOne({ projectName });
        let task = await Task.findOne({ taskName });
        let category = await Category.findOne({ categoryName: taskCategory });
        let agent = await User.findOne({ agentCategory: category._id });
        if (project && project.projectName === projectName) {
          res.status(200).json({
            message: ' A Project With The Same Name Already Exists.',
          });
        } else if (task && task.taskName === taskName) {
          res.status(200).json({
            message: 'A Task With The Same Name Already Exists.',
          });
        } else if (selectProject) {
          const newTask = await new Task({
            taskName: taskName,
            projectName: selectProjectName,
            taskDescription: req.body.taskDescription,
            projectId: selectProject._id,
            taskCategory: category._id,
            userId: user._id,
            agentId: agent._id,
            userName: user.first_name,
            agentName: agent.first_name,
          }).save();

          const allEmails = [
            ...adminEmailAddresses,
            ...superAdminEmailAddresses,
            agent.email,
          ];
          const options = {
            to: allEmails,
            subject: 'New Task Create✔ ',
            template: 'ADDTASK-CONTRACTOR',
            projectName: selectProjectName,
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            user,
          };
          await sendEmailNotify(options);

          const existingConversation = await Conversation.findOne({
            members: [agent._id, user._id],
            projectId: selectProject._id,
            taskId: newTask._id,
          });
          console.log('existingConversation', existingConversation);
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agent._id, user._id],
              projectId: selectProject._id,
              taskId: newTask._id,
            });

            await newConversation.save();
            // Use savedConversation as needed
          } else {
            res.status(500).json({ message: 'Conversation Already Exists' });
          }
          res
            .status(201)
            .json({ message: 'Task Created Successfully!!', task: newTask });
        } else {
          project = await new projectTask({
            projectName,
            userId: user._id,
            agentId: agent._id,
          }).save();

          const newTask = await new Task({
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            projectName: projectName,
            projectId: project._id,
            taskCategory: category._id,
            userId: user._id,
            agentId: agent._id,
            userName: user.first_name,
            agentName: agent.first_name,
          }).save();
          const allEmails = [
            ...adminEmailAddresses,
            ...superAdminEmailAddresses,
            agent.email,
          ];
          const options = {
            to: allEmails,
            subject: 'New Task Create✔ ',
            template: 'ADDTASK-CONTRACTOR',
            projectName: projectName,
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            user,
          };
          await sendEmailNotify(options);

          const existingConversation = await Conversation.findOne({
            members: [agent._id, user._id],
            projectId: project._id,
            taskId: newTask._id,
          });
          console.log('existingConversation', existingConversation);
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agent._id, user._id],
              projectId: project._id,
              taskId: newTask._id,
            });

            await newConversation.save();
          } else {
            res.status(500).json({ message: 'Conversation Already Exists' });
          }

          res
            .status(201)
            .json({ message: 'Task Created Successfully!', task: newTask });
        }
      } else {
        res.status(200).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error creating Task', error: error.message });
    }
  })
);

// delete all project and task

TaskRouter.delete(
  '/',
  expressAsyncHandler(async (req, res) => {
    await projectTask.deleteMany({});
    await Task.deleteMany({});
    res.send('deleted');
  })
);

// delete task

TaskRouter.delete(
  '/:taskId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.taskId);
      res.status(200).json('Task Deleted Successfully !');
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

// update task

TaskRouter.put(
  '/updateStatus/:taskId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { taskStatus } = req.body;
      console.log('taskStatus...........', taskStatus);
      if (!taskStatus) {
        return res.status(400).json({ message: 'Task status is required.' });
      }
      const updateStatus = await Task.findOneAndUpdate(
        { _id: req.params.taskId },
        { taskStatus },
        { new: true }
      );
      if (!updateStatus) {
        return res.status(404).json({ message: 'Task not found.' });
      }
      res.status(200).json({
        message: 'Update status successful',
        updatedTask: updateStatus,
      });
      console.log('response', updateStatus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
      console.log('error', error);
    }
  })
);

// get single project
TaskRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        res.status(400).json({ message: 'Project not found' });
      }
      const conversions = await Conversation.find({ taskId: req.params.id });
      const { ...other } = task._doc;
      res.json({
        ...other,
        conversions: conversions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);
export default TaskRouter;
