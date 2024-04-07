const express = require("express");
const cors = require("cors");
// const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const uploadController = require("./controllers/uploadController");
const bodyParser = require("body-parser");
require("dotenv").config();
const multer = require("multer");
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL;
// chat system
const SocketIo = require("./socket/index");
const app = require("express")();
const server = require("http").createServer(app);
const chatRoutes = require("./routes/chat/chat.route");
const messageRoutes = require("./routes/chat/message.route");

// app.use(cors({
//   origin: '*'
// }));
// chat system
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin:'http://localhost:3001',
    withCredentials: true, // send cookies
  },
});
app.set("io", io);

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/article", articleRoutes);
app.use("/chat", chatRoutes);
app.use("/messages", messageRoutes);

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadRouter = router.post(
  "/upload",
  upload.single("file"),
  uploadController.uploadFile
);
app.use("/", uploadRouter);

// chat system

SocketIo.initializeSocketIO(io);
// io.on("connection", (socket) => {
//   // console.log(socket);
//   console.log("Socket is actiove to be connected");

//   socket.on("chat", (payload) => {
//     // console.log(payload);
//     io.emit("chat", payload);
//   });
// });

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("db connected successfully");
    // we replace app to server for rening chat sockit io
    server.listen(port, () => {
      console.log(`server is working on port ${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to the database:", error));
