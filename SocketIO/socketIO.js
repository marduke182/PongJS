var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs');
//, mongo = require('mongodb');
  
//var host = 'localhost', port = 27017;


//var db = new mongo.Db('gamers', new mongo.Server(host, port, {}),{});

//db.open(function(a) {
//    console.log(a);
//});

app.listen(8080);

function handler (req, res) {

    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

var gameCount = 0;

io.sockets.on('connection', function (socket) {
    //    console.log(io.sockets);
    room = "game"+gameCount;
    
    //    gameCount++;
    if(io.sockets.clients(room).length > 2) {
        console.log("busy");
        socket.emit('welcome', {
            status: 'busy'
        });
    } else {
        console.log("welcome");
        
        socket.join(room,function() {
            socket.emit('welcome', {
                player: io.sockets.clients(room).length,
                status: 'welcome_baby'
            });    
        });
    }
    
    socket.on('move', function (data) {
        socket.broadcast.to(room).emit('move',data);
    });
});