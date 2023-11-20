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
      console.log(selectProjectName);
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
      if (project && project.projectName === projectName) {
        console.log('in if');
        res.status(200).json({
          message: 'project with the same name already exists',
        });
      } else if (task && task.taskName === taskName) {
        res.status(200).json({
          message: 'Task with the same name already exists',
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
        res.status(201).json({ message: 'Task Created', task: newTask });
      } else {
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
export default TaskRouter;
