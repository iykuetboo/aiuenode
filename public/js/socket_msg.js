socket.on('system-msg',(msg)=>{
    console.log("system: "+msg)
    $("#msg-box").append(`<div class='system-msg'>system: ${msg}</div>`)
})

socket.on('chat-msg',(msg)=>{
    console.log(`${msg.sender}: ${msg.text}`)
    $("#msg-box").append(`<div class='chat-msg'>${msg.sender}: ${msg.text}</div>`)
})

$('#chat-form').submit(function (e) {
    e.preventDefault();
    const field = $('#chat-form [name="text"]')[0]
    if(field.value==''){return false}
    socket.emit('chat', {text:field.value});
    field.value = '';
});
