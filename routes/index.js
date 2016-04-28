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



var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', function(req, res, next) {
  if(req.user != undefined){
        return res.sendfile('./public/html/index.html');
  }else{
        return res.sendfile('./public/html/login.html');
  }
  
});

module.exports = router;