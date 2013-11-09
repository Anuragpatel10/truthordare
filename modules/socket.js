var uid = require('uid');
exports = module.exports = function () {

    io.sockets.on('connection', function (socket) {
        socket.on("id", function (name) {
            var id = uid(7);
            console.log("Socket Room Created ---", id);
            console.log("Users in Room ---", io.sockets.clients(id));
            socket.join(id);
            socket.emit("gameInitiated", {name: name, id: id});
        });


        socket.on("joinGame", function (data) {
            socket.join(data.token);
            io.sockets.in(data.token).emit("newPlayerJoined", data);
            console.log("Users in Room ---", io.sockets.clients(data.token));
            socket.emit("joinedGame", data);
        });
    });

};