var uid = require('uuid');
exports = module.exports = function () {

    io.sockets.on('connection', function (socket) {
        socket.on("id", function () {
            var id=uid.v4();
            console.log("------------Socket Room " + id + "Created for User -------------");
            socket.join(id);
            socket.emit("gameInitiated", id);
        });


        socket.on("joinGame", function(data){
          socket.join(data);
          socket.emit("joinedGame", data.name);
        });
    });

};