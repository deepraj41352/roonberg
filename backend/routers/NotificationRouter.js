import express from 'express'
import Notification from "../Models/notificationModel.js";
const NotificationRouter = express.Router();


NotificationRouter.get("/",(req,res)=>{
    res.send("karan")
})

export default NotificationRouter;
