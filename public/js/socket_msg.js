
socket.on('system-msg',(msg)=>{
    console.log("system-msg: "+msg)
    $("#msg-box").append("<div>" + msg + "</div>")
})