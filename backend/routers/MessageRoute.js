import express from "express";
import Message from "../Models/messageModel.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { uploadDoc } from "./userRouter.js";
import multer from "multer";

const MessageRouter = express.Router();
const upload = multer();

//add

MessageRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    if (req.file) {
      const image = await uploadDoc(req);
      req.body.image = image;

      console.log("image", req.body.image);
    }
    const newMessage = new Message(
      req.body
      // conversationId: req.body.conversationId,
      // sender: req.body.sender,
      // text: req.body.text,
      // image: image,
    );
    console.log(newMessage.conversationId);

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

MessageRouter.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

MessageRouter.delete("/:conversationId", async (req, res) => {
  try {
    await Message.deleteMany({
      conversationId: req.params.conversationId,
    });
    res.status(200).json("message deleted");
  } catch (err) {
    console.log("error", err);
    return res.status(500).json(err);
  }
});

export default MessageRouter;
