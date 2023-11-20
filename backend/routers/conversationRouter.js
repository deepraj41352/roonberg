import express from 'express';
import Conversation from '../Models/conversationModel.js';

const conversationRouter = express.Router();

// get all the users who have conversation with current user 

conversationRouter.get('/:userId', async (req, res) => {
  try {
    const currentUser = req.params.userId;

    const Conversations = await Conversation.find({ members: { $in: [currentUser] } });


    if (Conversations) {
      console.log("users", Conversations);
      res.status(200).json(Conversations);
    }
    else {
      res.status(403).json({ message: "user not found" })
    }

  } catch (error) {
    res.status(500).json(err);
    console.log("error", error);
  }
})



//get conv of a user
1
conversationRouter.get('/:projectId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      projectId: req.params.projectId,
    });
    res.status(200).json(conversation);

  } catch (err) {
    res.status(500).json(err);
  }
});

conversationRouter.post('/:conversationId', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

conversationRouter.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default conversationRouter;
