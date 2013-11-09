var uid = require('uid');
exports = module.exports = function () {

    var usersInRoom = {};
    io.sockets.on('connection', function (socket) {
        socket.on("newGameRequest", function (name) {
            var id = uid(7);
            usersInRoom[name] = id;
            console.log("Socket Room Created ---", id);
            console.log("Users in Room ---", io.sockets.clients(id));
            socket.join(id);
            socket.emit("gameInitiated", {name: name, roomId: id});
        });


        socket.on("joinGame", function (data) {
            socket.join(data.token);
            usersInRoom[data.name] = data.token;
            io.sockets.in(data.token).emit("newPlayerJoined", usersInRoom);
            socket.emit("joinedGame", data);
        });
    });

};