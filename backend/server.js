// const express=require("express");
// const { chats } = require("./data/data");
// const {notFound,errorHandler}=require('./middleware/errorMiddleware')
// const app=express();
// app.use(express.json())
// const dotenv=require("dotenv");
// const connectDB = require("./config/db");
// const path=require("path");
// dotenv.config();  
// connectDB();
// const userRoutes=require("./routes/userRoutes")
// const chatRoutes=require("./routes/chatRoutes")
// const messageRoutes=require("./routes/messageRoutes")

// app.use('/api/user',userRoutes);
// app.use('/api/chat',chatRoutes);
// app.use("/api/message",messageRoutes);
// ////deployment------------
// const __dirname1=path.resolve();
// if(process.env.NODE_ENV==="production"){
// app.use(express.static(path.join(__dirname1,"/frontend/build")))
// app.get("*",(req,res)=>{
//     res.sendFile(__dirname1,"frontend","build","index.html");
// })
// }
// else{
//     app.get('/',(req,res)=>{
//         res.send("API is running successfully");
    
//     })

// }
// ///deployment-------------
// app.use(notFound)
// app.use(errorHandler)
// // app.get('/api/chat',(req,res)=>{
// //     res.send(chats);
// // })
// // app.get('/api/chat/:id',(req,res)=>{
// //     const singleChat=chats.find((c)=>c._id===req.params.id);
// //     res.send(singleChat);
// //     console.log(req.params.id)
// // })
// const PORT=process.env.PORT||5000;
// const server=app.listen(5000,console.log(`Server started on PORT ${PORT}`));
// const io=require('socket.io')(server,{
//     pingTimeout:60000,
//     cors:{
//         origin:"http://localhost:3000",
//     }
// })
// io.on("connection",(socket)=>{
//     console.log("Connected to socket.io");
//     socket.on('setup',(userData)=>{
//         socket.join(userData._id);
//         console.log(userData._id)
//         socket.emit("connected")
//     })
//     socket.on("typing", (room) => socket.in(room).emit("typing"));
//     socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
//     socket.on("join chat", (room) => {
//         socket.join(room);
//         console.log("User Joined Room: " + room);
//       });
//       socket.on("new message", (newMessageRecieved) => {
//         var chat = newMessageRecieved.chat;
    
//         if (!chat.users) return console.log("chat.users not defined");
    
//         chat.users.forEach((user) => {
//           if (user._id == newMessageRecieved.sender._id) return;
    
//           socket.in(user._id).emit("message recieved", newMessageRecieved);
//         });
//         socket.off("setup", () => {
//             console.log("USER DISCONNECTED");
//             socket.leave(userData._id);
//           });
//       });
// })
const express = require("express");
const { chats } = require("./data/data");
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socketIO = require('socket.io');

// Load environment variables
dotenv.config();  
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Routes for user, chat, and message APIs
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);

// Deployment: Serve static files in production
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get('/', (req, res) => {
    res.send("API is running successfully");
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Express Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

// Socket.io Configuration
const io = socketIO(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",  // Update this to your production frontend URL if needed
  }
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  let userData;

  // Setup the user and join a specific room (user-based)
  socket.on('setup', (data) => {
    userData = data;
    socket.join(userData._id);  // Join a room specific to the user
    console.log("User setup:", userData._id);
    socket.emit("connected");
  });

  // Handle typing events in a specific chat room
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  // Handle stop typing events in a specific chat room
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  // Join a specific chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  // Receive new messages and broadcast to all other users in the chat
  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // Handle user disconnection and clean up rooms
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED:", userData ? userData._id : "Unknown user");
    if (userData) {
      socket.leave(userData._id);
    }
  });
});
