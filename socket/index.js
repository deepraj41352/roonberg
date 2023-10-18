const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
const fs = require('fs')
const path = require('path');
const express = require("express");
const http = require("http");

const app = express();
const port = process.env.PORT || 4500;
const server = http.createServer(app);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});

let users =[];

const addUser = (userId , socketId) =>{
  !users.some((user)=> user.userId===userId) && users.push({userId,socketId})
}

const removeUser =(socketId)=>{
  users = users.filter((user)=>user.socketId!==socketId)
}

const getUser = (userId)=>{
  return users.find((user)=>user.userId===userId)
}

io.on("connection", (socket) => {
  //   //when ceonnect
    console.log("a user connected.");
    socket.on("addUser",(userId )=>{
      addUser(userId,socket.id)
      io.emit("getUsers",users)
    })


    socket.on('image', (data) => {
      // const text = data.text;
      const base64Image = data.image;
      const senderId = getUser(data.senderId)
      const user = getUser(data.receiverdId)
if(user){
  
      if (base64Image) {
        // Remove the data:image/jpeg;base64 prefix and convert to a Buffer
        const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  
        const imageFileName = `uploads/${Date.now()}.jpeg`;
  
        fs.writeFile(imageFileName, imageBuffer, (err) => {
          if (err) {
            console.error(err);
          } else {
            // Broadcast the image URL to all clients
            io.to(user.socketId).emit('image', { senderId:data.senderId, image: imageFileName });
            io.to(senderId.socketId).emit('image', { senderId:data.senderId, image: imageFileName });
          }
        });
      } else {
        // Broadcast the text message to all clients
        io.emit('message', { text });
      }
    }else{
      console.log("karan sgarma")
    }

    });



    // send and get message 
socket.on("sendMessage",({senderId,receiverdId,text})=>{
  const user = getUser(receiverdId)
  if(user){
  io.to(user.socketId).emit("getMessage",{
    senderId,
    text,
  })
  }else{
    console.log("karan")
  }
})


    // when disconnect 
    socket.on("disconnect",()=>{
      console.log("a user disconnected")
      removeUser(socket.id)
      io.emit("getUsers",users)

    })

})

