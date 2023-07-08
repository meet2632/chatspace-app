const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');


const app = express();
// To use server directly we use by createServer method for handling socket.io
const server = http.createServer(app);
const io = socketio(server);

// set static folder for current directory and public folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatSpace Bot';

// Run when client connects
// socekt.emit() - emits msg to single user that's connecting
// socket.broadcast.emit*() - emits msg to everybody except user itself
// io.emit() - emits all clients in general

// Run when client connects
io.on('connection', socket => {
    // Actually join the room - whatever room user joins from URL
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        // Join
        socket.join(user.room);
        // Welcome current user default sent to chat by server
        socket.emit('message', formatMessage(botName, 'Welcome to ChatSpace!')); // We are sending these 'messages' on server side
        // Broadcasts when user joins to a particular room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has  joined the chat`));
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    }); 

    // Listen for chatMessage or catching chatMessage on server - OR message sent by user 
    socket.on('chatMessage', (msg) => {
        // Using getCurrentUser method for getting username when chats in room
        const user = getCurrentUser(socket.id)
        // Emit to everybody - taking message from user
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} left the chat`));
        }
        // Send users and room info when disconnects
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));