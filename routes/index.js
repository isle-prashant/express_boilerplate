module.exports = function (io) {

    var express = require('express');
    var router = express.Router();

    router.get('/', function (req, res, next) {
        path = 'index.html';
        res.sendfile('./public/html/index.html');


    });


    io.on('connection', function (socket) {
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
        });
    });

    return router;
}