import express from 'express';
import Message from '../Models/messageModel.js';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { uploadDoc } from './userRouter.js';
import multer from 'multer';

const MessageRouter = express.Router();
//add

MessageRouter.post('/audio', upload.single('media'), async (req, res) => {
  try {
    if (req.file) {
      const mediaType = req.body.mediaType;
      console.log('mediasendingtypeaudio', req.body.mediaType);

      const media = await uploadDoc(req, mediaType);
      req.body.audio = media;
      console.log('Media:', req.body.audio);
    }
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

MessageRouter.post('/', upload.single('media'), async (req, res) => {
  try {
    if (req.file) {
      const mediaType = req.body.mediaType;
      console.log('mediasendingtype', req.body.mediaType);

      const media = await uploadDoc(req, mediaType);
      req.body.image = media;
      console.log('Media:', req.body.image);
    }

    const newMessage = new Message(req.body);
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

//..............delete mesage..............

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
