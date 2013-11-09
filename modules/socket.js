var uid = require('uid');
var twilio = require("twilio");

exports = module.exports = function () {
    var usersInRoom = {};
    io.sockets.on('connection', function (socket) {
        socket.on("newGameRequest", function (name) {
            var id = uid(7);
            usersInRoom[name] = id;
            console.log("Socket Room Created ---", id);
            console.log("Users in Room ---", io.sockets.clients(id));
            socket.join(id);
            socket.emit("gameInitiated", {name: name, id: id});
        });


        socket.on("joinGame", function (data) {
            socket.join(data.token);
            usersInRoom[data.name] = data.token;
            io.sockets.in(data.token).emit("newPlayerJoined", usersInRoom);
            socket.emit("joinedGame", data);
        });

        socket.on("sendMessageInvite", function(number){
            sendMessageInviteThroughTwilio(number);
        });
    });
};


function sendMessageInviteThroughTwilio(number){
    var client = new twilio.RestClient('ACfb944b59f4c888d49666be23900ca366', '41a8b2de3d17a9f83c70e0ff8032fc15');
    client.sms.messages.create({
        to: number,
        from:'+18129727195',
        body:'Hey, You have been invited to play TruthAndDare'
    }, function(error, message) {
        if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
        }
        else {
            console.log('Oops! There was an error.');
        }
    });
}