/*var express = require('express');
var http = require('http').Server(express);
var io = require('socket.io')(http);
var router = express.Router();

/!* GET home page. *!/
router.get('/', function(req, res, next) {
 // res.render('index', { title: 'Express' });
  path = 'index.html';
    res.sendfile('index.html');
});


io.on('connection', function(socket){
    console.log("User got connected");
});

module.exports = router;*/
module.exports = function(io) {

    var express = require('express');
    var router = express.Router();

    router.get('/', function (req, res, next) {
        path = 'index.html';
        res.sendfile('./public/html/index.html');


    });


    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });
    });

     return router;
}