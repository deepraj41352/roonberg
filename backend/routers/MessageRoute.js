import express from 'express';
import Message from '../Models/messageModel.js';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const MessageRouter = express.Router();
//add

MessageRouter.post('/', async (req, res) => {
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

MessageRouter.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

MessageRouter.delete('/:conversationId', async (req, res) => {
  try {
    await Message.deleteMany({
      conversationId: req.params.conversationId,
    });
    res.status(200).json('message deleted');
  } catch (err) {
    console.log('error', err);
    return res.status(500).json(err);
  }
});

export default MessageRouter;
