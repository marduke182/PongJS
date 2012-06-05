var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, mongo = require('mongodb');
  
var host = 'localhost', port = 27017;


var db = new mongo.Db('gamers', new mongo.Server(host, port, {}),{});

db.open(function(a) {
    console.log(a);
});

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


io.sockets.on('connection', function (socket) {
    console.log(io.sockets);
  
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function (data) {
        db.collection("user", function(err,collection) {
            console.log("Insert");
            collection.insert(socket, function() {
                console.log("After Insert");
            });
        })
    
    });
});