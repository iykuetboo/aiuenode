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
const roomutils = require('./roomutils')
const rooms = {}
const players = {}

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('login', (data) => {
    console.log(`${data.name}(id:${socket.id}) entered to ${data.room}`);

    let r;
    if(data.room in rooms){
      r = rooms[data.room]
    }else{
      r = new roomutils.room(data.room,io);
      rooms[data.room] = r
    }

    const p = new roomutils.player(socket.id, data.name);
    //todo: playerをsocked_idに対して一意なモノに

    const err = roomutils.join(r,p);
    if(err){
      console.log(err.msg);
      io.to(p.id).emit("system-msg", `${err.code}: ${err.msg}`);
      return;
    }
    console.log(r.players)
    // roomutils.emit(r,"system-msg",`${p.name} entered Room:${r.id}`)
    r.emit("system-msg",`${p.name} entered Room:${r.id}`);
  });

});


setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
// setInterval(() => io.emit('system-msg', new Date().toTimeString()), 5000);

// function emit(room,key,data){}

