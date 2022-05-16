console.log("socket_login loaded")
$('#login-form').submit(function (e) {
    e.preventDefault();
    var room = $('#login-form [name="room"]').val();
    var name = $('#login-form [name="name"]').val();
    console.log(`login to ${room} as ${name}`)
    socket.emit('login', { room: room, name: name });
});
