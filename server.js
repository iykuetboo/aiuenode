'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static(__dirname + '/public'))
  .set('view engine', 'ejs')
  .get("/", function (req, res, next) { res.render("index", {}); })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//------------------------------------------------------------------------------

const io = socketIO(server);
const roomutils = require('./roomutils');
const Room = roomutils.Room;
const Player = roomutils.Player;
Room.io = io;

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on('disconnect', () => console.log(`Client ${socket.id} disconnected`));

  socket.on('login', (data) => {
    console.log(`${data.name}(id:${socket.id}) entered to ${data.room}`);

    const p = Player.get(socket.id)

    let r = Room.get(data.room)
    const err = p.join(r);
    if(err){
      console.log(err.msg);
      io.to(socket.id).emit("system-msg", `${err.code}: ${err.msg}`);
      return;
    }
    
    p.name = data.name
    
    r.emit("system-msg",`${p.name} entered Room:${r.id}`);
  });

  socket.on('logout', (data) => {
    const p = Player.get(socket.id)
    const r = Room.get(p.joined_room)

    const err = p.exit();
    if(err){
      console.log(err.msg);
      io.to(socket.id).emit("system-msg", `${err.code}: ${err.msg}`);
      return;
    }
    
    r.emit("system-msg",`${p.name} left Room:${r.id}`);
    io.to(socket.id).emit("system-msg",`${p.name} left Room:${r.id}`);
  });

  socket.on('chat', (data) => {
    const p = Player.get(socket.id)
    const r = Room.get(p.joined_room)
    r.emit('chat-msg', {sender:p.name, text:data.text})
  })

});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);