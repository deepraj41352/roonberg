import express from 'express';
import Conversation from '../Models/conversationModel.js';

const conversationRouter = express.Router();

//new conv

conversationRouter.post('/', async (req, res) => {
  const agentUser = await User.findOne({ role: 'agent' });
  const contractorUser = await User.findOne({ role: 'contractor' });
  const newConversation = new Conversation({
    members: [agentUser._id, contractorUser._id],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

conversationRouter.get('/:userId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
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
