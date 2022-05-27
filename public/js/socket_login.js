console.log("socket_login loaded")
$('#login-form').submit(function (e) {
    e.preventDefault();
    var room = $('#login-form [name="room"]').val();
    var name = $('#login-form [name="name"]').val();
    socket.emit('login', { room: room, name: name });
    
    update_view("standby")
});


$('#logout-form').submit(function (e) {
    e.preventDefault();
    socket.emit('logout', {});

    update_view("title");
});

$('#standby-form').submit(function (e) {
    e.preventDefault();
    socket.emit('get-ready', {});
    $('#standby-form > .bms_send_btn').addClass('disabled');
});
