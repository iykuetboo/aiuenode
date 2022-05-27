socket.on('system-msg',(msg)=>{
    console.log("system: "+msg);
    $("#msg-box").prepend(`
    <tr>
      <td class="chatlog-speaker">system</td>
      <td class="chatlog-separator"> : </td>
      <td class="chatlog-text">${msg}</td>
    </tr>`);
    $("#msg-box").parent().scrollTop = 0;
})

socket.on('chat-msg',(msg)=>{
  console.log(`${msg.sender}: ${msg.text}`);
  $("#msg-box").prepend(`
  <tr>
    <td class="chatlog-speaker player${msg.p_id}">${msg.sender}</td>
    <td class="chatlog-separator  player${msg.p_id}"> : </td>
    <td class="chatlog-text  player${msg.p_id}">${msg.text}</td>
  </tr>`);
})

$('#chat-form').submit(function (e) {
    e.preventDefault();
    const field = $('#chat-form [name="text"]')[0]
    if(field.value==''){return false}
    socket.emit('chat', {text:field.value});
    field.value = '';
});
