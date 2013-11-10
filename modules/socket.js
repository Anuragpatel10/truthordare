var uid = require('uid');
var twilio = require("twilio");

exports = module.exports = function () {
    var that = this;
    var usersInRoom = {};
    io.sockets.on('connection', function (socket) {
        socket.on("newGameRequest", function (name) {
            var id = uid(3);
            usersInRoom[id] = [{"name": name, "initiator": true}];
            console.log("Socket Room Created ---", id);
            socket.join(id);
            socket.emit("gameInitiated", {name: name, roomId: id});
        });


        socket.on("joinGame", function (data) {
            socket.join(data.token);
            if(usersInRoom && usersInRoom[data.token] && usersInRoom[data.token].length > 0) {
                if(usersInRoom[data.token].length < 5) {
                    usersInRoom[data.token].push({"name": data.name});
                } else {
                    socket.emit("roomFull", {room: data.token, user: });
                    return;
                }
            } else {
                usersInRoom[data.token] = [{"name": data.name}];
            }
            io.sockets.in(data.token).emit("newPlayerJoined", {name: data.name, token: data.token});
            socket.emit("joinedGame", data);
        });

        socket.on("sendMessageInvite", function(data){
            sendMessageInviteThroughTwilio.apply(that, [data.number, data.token, data.initiator, function(err, result){
                socket.emit("inviteResponse", {"error":err, "result": "SENT"});
            }]);
        });

        socket.on("getUsersInRoom", function(roomId) {
            console.log("Sending users list for room ", roomId);
            socket.emit("usersInRoomResponse", usersInRoom[roomId]);
        });
    });
};


function sendMessageInviteThroughTwilio(number, token, initiator,  callback){
    var client = new twilio.RestClient('ACfb944b59f4c888d49666be23900ca366', '41a8b2de3d17a9f83c70e0ff8032fc15');
    client.sms.messages.create({
        to: number,
        from:'+18129727195',
        body:'Hey, You have been invited to play TruthAndDare by '+ initiator +', Join by entering this code - '+ token
    }, function(error, message) {
        if (!error) {
            console.log('Message sent on:');
            console.log(message.dateCreated);
            callback(null, message);
        }
        else {
            console.log(error);
            console.log('Oops! There was an error.');
            callback(error, null);
        }
    });
}
