var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
    socket.on('tick', function (data) {
        socket.broadcast.emit('tick',data);
    });
});