const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const socketIo = require('socket.io');
const http = require('http');
const socketConnect = require('./config/socketConnect.js');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const organisaerRoutes = require('./routes/organisaers');

const db = require('./config/connection');

db();

const app = express();
const server = http.createServer(app);

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));


app.use((req, res, next) => {                      
  res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Enable credentials

  next();
});


app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200'],
  methods: ["GET,HEAD,OPTIONS,POST,PUT"]
}));

app.use(cookieParser());
app.use(express.json());
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/organisaer", organisaerRoutes);


const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    credentials: true,
    origin: 'http://localhost:4200'
  }
});

let activeUsers = {};
socketConnect(io, activeUsers);

server.listen(5000, () => {
  console.log("App is listening on port 5000");
});
