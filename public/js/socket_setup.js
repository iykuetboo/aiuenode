const socket = io();

socket.on('time', (timeString) => {
    const el = document.getElementById('server-time');
    el.innerHTML = 'Server time: ' + timeString;
});
