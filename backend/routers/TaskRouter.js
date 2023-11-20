import express from 'express';
import Notification from '../Models/notificationModel.js';
import { isAuth } from '../util.js';
import expressAsyncHandler from 'express-async-handler';
import projectTask from '../Models/projectTaskModel.js';
import Task from '../Models/taskModel.js';
import Category from '../Models/categoryModel.js';
import User from '../Models/userModel.js';

const TaskRouter = express.Router();

TaskRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const projects = await projectTask.find();
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
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

TaskRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = req.user;
      const selectProjectName = req.body.selectProjectName;
      const projectName = req.body.projectName;
      const taskName = req.body.taskName;
      const taskCategory = req.body.taskCategory;

      let selectProject = await projectTask.findOne({
        projectName: selectProjectName,
      });
      let project = await projectTask.findOne({ projectName });
      let task = await Task.findOne({ taskName });
      let category = await Category.findOne({ categoryName: taskCategory });
      let agent = await User.findOne({ agentCategory: category._id });
      if (project) {
        res.status(200).json({
          message: 'project with the same name already exists',
        });
      }
      if (task) {
        res.status(200).json({
          message: 'Task with the same name already exists',
        });
      }

      if (!project) {
        project = await new projectTask({
          projectName,
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

        res.status(201).json({ message: 'Task Created', task: newTask });
      } else {
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

        res.status(201).json({ message: 'Task Created', task: newTask });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error creating Task', error: error.message });
    }
  })
);

TaskRouter.delete(
  '/',
  expressAsyncHandler(async (req, res) => {
    await projectTask.deleteMany({});
    await Task.deleteMany({});
    res.send('deleted');
  })
);
export default TaskRouter;
