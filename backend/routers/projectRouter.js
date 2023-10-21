import express from 'express';
import Project from '../Models/projectModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdminOrSelf, sendEmailNotify } from '../util.js';
import User from '../Models/userModel.js';
import Conversation from '../Models/conversationModel.js';
import Category from '../Models/categoryModel.js';
import CustomEmail from '../Models/customEmailModul.js';

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
        projects.sort((a, b) => b.createdAt - a.createdAt); //for data descending order
        res.json(projects);
      } else if (userRole === 'contractor') {
        // Contractors can only access their own projects
        const contractorId = req.user._id; // Replace with the actual way you identify the contractor
        const projects = await Project.find({ projectOwner: contractorId });
        projects.sort((a, b) => b.createdAt - a.createdAt); //for data descending order
        res.json(projects);
      } else if (userRole === 'agent') {
        // Contractors can only access their own projects
        const agentId = req.user._id; // Replace with the actual way you identify the contractor
        const projects = await Project.find({
          'assignedAgent.agentId': agentId,
        });
        projects.sort((a, b) => b.createdAt - a.createdAt); //for data descending order
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
projectRouter.put(
  '/assign-update/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      const projectId = req.params.id;
      const contractorId = req.body.projectOwner;
      const assignedAgent = req.body.assignedAgent;
      const agentIds = assignedAgent.map((agent) => agent.agentId);
      console.log("agentIds", agentIds);
      const user = await User.findById(contractorId, 'first_name email');

      // const projectId = req.params.id;
      // const agentId = req.body.agentId;
      // const categoryId = req.body.categoryId;
      // const category = await Category.findById(categoryId);
      // const user = await User.findById(agentId, '_id first_name email');

      const updateFields = {

        assignedAgent,

        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        projectCategory: req.body.projectCategory,
        createdDate: req.body.createdDate,
        endDate: req.body.endDate,
        projectStatus: req.body.projectStatus,
        projectOwner: contractorId,
      };
      console.log("updateFields", updateFields)

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updateFields }, // Use $set to update the specified fields
        { new: true }
      );
      const agentEmails = await User.find({ _id: { $in: agentIds } }, 'email');
      const agentEmailList = agentEmails.map((agent) => agent.email);
      const options = {
        to: agentEmailList,
        subject: 'New Project Assigned ✔',
        template: 'ASSIGN-PROJECT',
        projectName: updatedProject.projectName,
        projectDescription: updatedProject.projectDescription,
        user,
      };

      await sendEmailNotify(options);

      for (const agentId of agentIds) {
        const newConversation = new Conversation({
          members: [agentId, contractorId],
          projectId: projectId,
        });

        await newConversation.save();
      }

      res.status(200).json({ updatedProject, agent: user });
    } catch (error) {
      console.error('Error assigning the project:', error);
      res.status(500).json({ error: 'Error assigning the project' });
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
      const contractorId = req.body.projectOwner;
      const assignedAgent = req.body.assignedAgent;
      const agentIds = assignedAgent.map((agent) => agent.agentId);
      console.log('agentIds', agentIds);
      const user = await User.findById(contractorId, 'first_name email');

      if (userRole === 'admin' || userRole === 'superadmin') {
        const newProject = new Project({
          projectName: req.body.projectName,
          projectDescription: req.body.projectDescription,
          projectCategory: req.body.projectCategory,
          createdDate: req.body.createdDate,
          endDate: req.body.endDate,
          projectStatus: req.body.projectStatus,
          projectOwner: contractorId,
          assignedAgent: assignedAgent,
        });

        const project = await newProject.save();

        const agentEmails = await User.find(
          { _id: { $in: agentIds } },
          'email'
        );
        const agentEmailList = agentEmails.map((agent) => agent.email);

        console.log('contractormail', user.email);
        console.log('agentEmails', agentEmailList);

        const toEmails = [user.email, ...agentEmailList];
        console.log('bothmail', toEmails);
        const options = {
          to: toEmails,
          subject: 'New Project Create✔',
          template: 'CREATE-PROJECT',
          projectName: req.body.projectName,
          projectDescription: req.body.projectDescription,
          user,
        };
        await sendEmailNotify(options);
        for (const agentId of agentIds) {
          const newConversation = new Conversation({
            members: [agentId, contractorId],
            projectId: project._id,
          });
          await newConversation.save();
        }
        for (const agentId of agentIds) {
          const agentEmail = await User.findById(agentId, 'email');
          const newCustomEmail = new CustomEmail({
            projectId: project._id,
            contractorEmail: user.email,
            contractorCustomEmail: `${contractorId}_${project._id}_${new Date()
              .toISOString()
              .replace(/[^0-9]/g, '')}`,
            agentEmail: agentEmail.email,
            agentCustomEmail: `${agentId}_${project._id}_${new Date()
              .toISOString()
              .replace(/[^0-9]/g, '')}`,
          });
          await newCustomEmail.save();
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
//................ admin create Project .....................

// projectRouter.post(
//   '/admin/addproject',
//   isAuth,
//   isAdminOrSelf,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const userRole = req.user.role;
//       const contractorId = req.body.projectOwner;
//       const assignedAgent = req.body.assignedAgent;
//       const categoryId = req.body.categoryId;

//       const agentIds = assignedAgent.map((agent) => agent.agentId);
//       console.log('agentIds', agentIds);
//       const user = await User.findById(contractorId, 'first_name email');
//       const agentuser = await User.findById(
//         assignedAgent,
//         '_id first_name email'
//       );
//       const category = await Category.findById(categoryId);

//       if (userRole === 'admin' || userRole === 'superadmin') {
//         const newProject = new Project({
//           projectName: req.body.projectName,
//           projectDescription: req.body.projectDescription,
//           projectCategory: req.body.projectCategory,
//           createdDate: req.body.createdDate,
//           endDate: req.body.endDate,
//           projectStatus: req.body.projectStatus,
//           projectOwner: contractorId,
//           assignedAgent: assignedAgent,
//         });
//         console.log("projectCreated", newProject)
//         const project = await newProject.save();

//         const agentEmails = await User.find(
//           { _id: { $in: agentIds } },
//           'email'
//         );
//         const agentEmailList = agentEmails.map((agent) => agent.email);

//         const toEmails = [user.email, ...agentEmailList];
//         const options = {
//           to: toEmails,
//           subject: 'New Project Create✔',
//           template: 'CREATE-PROJECT',
//           projectName: req.body.projectName,
//           projectDescription: req.body.projectDescription,
//           user,
//         };
//         await sendEmailNotify(options);

//         if (project.assignedAgent) {
//           const newConversation = new Conversation({
//             members: [user._id, updatedProject.projectOwner],
//             projectId: project._id,
//           });
//           await newConversation.save();
//         }
//         res.status(201).json({ message: 'Project Created', project });
//       } else {
//         res.status(403).json({ message: 'Access denied' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   })
// );

projectRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const categoryIds = req.body.projectCategory;
      const getCategoryNames = async (categoryIds) => {
        const categoryNames = [];
        for (const categoryId of categoryIds) {
          const category = await Category.findById(categoryId);
          if (category) {
            categoryNames.push(category.categoryName);
          }
        }
        return categoryNames;
      };

      const categoryNames = await getCategoryNames(categoryIds);
      const projectCategorys = [];

      for (let i = 0; i < categoryIds.length; i++) {
        projectCategorys.push({
          categoryId: categoryIds[i],
          categoryName: categoryNames[i],
        });
      }
      const newProject = new Project({
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        projectCategory: projectCategorys,
        createdDate: req.body.createdDate,
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
        subject: 'New Project Created ✔',
        template: 'CREATE-PROJECT',
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        user,
      };

      // Send the email
      const checkMail = await sendEmailNotify(options);

      if (checkMail) {
        console.log('Email notification sent to admins.');
        res
          .status(201)
          .json({ message: 'Project Created', project, categoryNames });
      } else {
        console.log('Failed to send the email notification.');
        res
          .status(201)
          .json({ message: 'Project Created', project, categoryNames });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating project', error });
    }
  })
);

// projectRouter.post(
//   '/assign-project/:id',
//   isAuth,
//   // isAdminOrSelf,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const userEmail = req.user.email;
//       const userId = req.user._id;
//       const projectId = req.params.id;
//       const agentId = req.body.agentId;
//       const categoryId = req.body.categoryId;
//       const category = await Category.findById(categoryId);

//       const user = await User.findById(agentId, '_id first_name email');
//       const updatedProject = await Project.findByIdAndUpdate(
//         projectId,
//         {
//           $push: {
//             assignedAgent: {
//               agentId: agentId,
//               agentName: user.first_name,
//               categoryId: categoryId,
//               categoryName: category.categoryName,
//             },
//           },
//         },
//         { new: true }
//       );

//       const options = {
//         to: user.email,
//         subject: 'New Project Create ✔',
//         template: 'CREATE-PROJECT',
//         projectName: updatedProject.projectName,
//         projectDescription: updatedProject.projectDescription,
//         user,
//       };
//       await sendEmailNotify(options);
//       if (updatedProject.assignedAgent) {
//         const newConversation = new Conversation({
//           members: [user._id, updatedProject.projectOwner],
//           projectId: projectId,
//         });
//         await newConversation.save();
//         const newCustomEmail = new CustomEmail({
//           projectId: projectId,
//           contractorEmail: userEmail,
//           contractorCustomEmail: `${userId}_${projectId}_${new Date()
//             .toISOString()
//             .replace(/[^0-9]/g, '')}`,
//           agentEmail: user.email,
//           agentCustomEmail: `${agentId}_${projectId}_${new Date()
//             .toISOString()
//             .replace(/[^0-9]/g, '')}`,
//         });
//         await newCustomEmail.save();
//       }
//       res.status(200).json({ updatedProject, agent: user });
//     } catch (error) {
//       console.error('Error assigning the project:', error);
//       res.status(500).json({ error: 'Error assigning the project' });
//     }
//   })
// );

projectRouter.post(
  '/assign-project/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const projectId = req.params.id;
      const agent = req.body.assignedAgent;
      const contractorId = req.body.projectOwner;
      const agentIds = agent.map((agent) => agent.agentId);
      const user = await User.findById(contractorId, 'first_name email');
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          assignedAgent: agent,
        },

        { new: true }
      );
      console.log(updatedProject);
      const agentEmails = await User.find({ _id: { $in: agentIds } }, 'email');
      const agentEmailList = agentEmails.map((agent) => agent.email);
      const options = {
        to: agentEmailList,
        subject: 'New Project Create ✔',
        template: 'CREATE-PROJECT',
        projectName: updatedProject.projectName,
        projectDescription: updatedProject.projectDescription,
        agentEmailList,
      };
      await sendEmailNotify(options);
      for (const agentId of agentIds) {
        const newConversation = new Conversation({
          members: [agentId, contractorId],
          projectId: projectId,
        });
        await newConversation.save();
      }
      for (const agentId of agentIds) {
        const agentEmail = await User.findById(agentId, 'email');
        const newCustomEmail = new CustomEmail({
          projectId: projectId,
          contractorEmail: user.email,
          contractorCustomEmail: `${contractorId}_${projectId}_${new Date()
            .toISOString()
            .replace(/[^0-9]/g, '')}`,
          agentEmail: agentEmail.email,
          agentCustomEmail: `${agentId}_${projectId}_${new Date()
            .toISOString()
            .replace(/[^0-9]/g, '')}`,
        });
        await newCustomEmail.save();
      }
      res.status(200).json({ updatedProject, agent: agentIds });
    } catch (error) {
      console.error('Error assigning the project:', error);
      res.status(500).json({ error: 'Error assigning the project' });
    }
  })
);

projectRouter.put(
  '/assign-update/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      const projectId = req.params.id;
      const contractorId = req.body.projectOwner;
      const assignedAgent = req.body.assignedAgent;
      const agentIds = assignedAgent.map((agent) => agent.agentId);
      console.log('agentIds', agentIds);
      const user = await User.findById(contractorId, 'first_name email');
      const updateFields = {
        assignedAgent,

        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        projectCategory: req.body.projectCategory,
        createdDate: req.body.createdDate,
        endDate: req.body.endDate,
        projectStatus: req.body.projectStatus,
        projectOwner: contractorId,
      };
      console.log('updateFields', updateFields);

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updateFields },
        { new: true }
      );
      const agentEmails = await User.find({ _id: { $in: agentIds } }, 'email');
      const agentEmailList = agentEmails.map((agent) => agent.email);
      const options = {
        to: agentEmailList,
        subject: 'New Project Assigned ✔',
        template: 'ASSIGN-PROJECT',
        projectName: updatedProject.projectName,
        projectDescription: updatedProject.projectDescription,
        user,
      };

      await sendEmailNotify(options);

      for (const agentId of agentIds) {
        const newConversation = new Conversation({
          members: [agentId, contractorId],
          projectId: projectId,
        });
        await newConversation.save();
      }
      for (const agentId of agentIds) {
        const agentEmail = await User.findById(agentId, 'email');
        const newCustomEmail = new CustomEmail({
          projectId: projectId,
          contractorEmail: user.email,
          contractorCustomEmail: `${contractorId}_${projectId}_${new Date()
            .toISOString()
            .replace(/[^0-9]/g, '')}`,
          agentEmail: agentEmail.email,
          agentCustomEmail: `${agentId}_${projectId}_${new Date()
            .toISOString()
            .replace(/[^0-9]/g, '')}`,
        });
        await newCustomEmail.save();
      }
      res.status(200).json({ updatedProject, agent: user });
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
      const dataprojectupdate = await project.updateOne({ $set: req.body });
      console.log('dataprojectupdate', dataprojectupdate);
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
  '/getproject/:userId',
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("userid", userId)
      const projects = await Project.find({
        $or: [
          { projectOwner: userId },
          {
            'assignedAgent.agentId': userId
          }
        ]
      });
      if (!projects || projects.length === 0) {
        res.status(404).json({ message: 'No projects found for this user' });
      } else {
        const projectIds = projects.map(project => project._id);
        const conversations = await Conversation.find({ projectId: { $in: projectIds } });
        res.json({ projects, conversations });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

projectRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await Project.findById(req.params.id);
      const project = await Project.findById(req.params.id);
      if (!project) {
        console.log(project)
        res.status(400).json({ message: 'Project not found' });
      }
      const conversions = await Conversation.find({ projectId: req.params.id });
      const customEmail = await CustomEmail.find({ projectId: req.params.id });
      const { ...other } = project._doc;
      res.json({
        ...other,
        conversions: conversions,
        customEmail: customEmail,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

// gaytri

// projectRouter.post(
//   '/assign-project/:id',
//   isAuth,
//   isAdminOrSelf,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const projectId = req.params.id;
//       const agentId = req.body.agentId;
//       const categoryId = req.body.categoryId;
//       const category = await Category.findById(categoryId);

//       const user = await User.findById(agentId, '_id first_name email');
//       const updatedProject = await Project.findByIdAndUpdate(
//         projectId,
//         {
//           $push: {
//             assignedAgent: {
//               agentId: agentId,
//               agentName: user.first_name,
//               categoryId: categoryId,
//               categoryName: category.categoryName,
//             },
//           },
//         },
//         { new: true }
//       );

//       const options = {
//         to: user.email,
//         subject: 'New Project Create ✔',
//         template: 'CREATE-PROJECT',
//         projectName: updatedProject.projectName,
//         projectDescription: updatedProject.projectDescription,
//         user,
//       };
//       await sendEmailNotify(options);
//       if (updatedProject.assignedAgent) {
//         const newConversation = new Conversation({
//           members: [user._id, updatedProject.projectOwner],
//           projectId: projectId,
//         });
//         await newConversation.save();
//       }
//       res.status(200).json({ updatedProject, agent: user });
//     } catch (error) {
//       console.error('Error assigning the project:', error);
//       res.status(500).json({ error: 'Error assigning the project' });
//     }
//   })
// );


projectRouter.post(
  '/assign-project/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const projectId = req.params.id;
      const agent = req.body.assignedAgent;
      const contractorId = req.body.projectOwner;
      // const categoryId = req.body.categoryId;
      // const category = await Category.findById(categoryId);
      const agentIds = agent.map((agent) => agent.agentId);
      // const user = await User.findById(agentId, '_id first_name email');
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          assignedAgent: agent
        },

        { new: true }
      );
      console.log(updatedProject)
      const agentEmails = await User.find({ _id: { $in: agentIds } }, 'email');
      const agentEmailList = agentEmails.map((agent) => agent.email);
      const options = {
        to: agentEmailList,
        subject: 'New Project Create ✔',
        template: 'CREATE-PROJECT',
        projectName: updatedProject.projectName,
        projectDescription: updatedProject.projectDescription,
        agentEmailList,
      };
      await sendEmailNotify(options);
      for (const agentId of agentIds) {
        const newConversation = new Conversation({
          members: [agentId, contractorId],
          projectId: projectId,
        });
        await newConversation.save();
        console.log(newConversation)
      }

      res.status(200).json({ updatedProject, agent: agentIds });

    } catch (error) {
      console.error('Error assigning the project:', error);
      res.status(500).json({ error: 'Error assigning the project' });
    }
  })
);

export default projectRouter;
