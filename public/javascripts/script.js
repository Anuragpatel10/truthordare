var script = (function () {
    var script = {};

    script.domElementsEnum = {
        "GAME_ID": "#gameRoomId",
        "USER_NAME": "#gameInitNameField",
        "JOIN_USERNAME": "#gameJoinNameField",
        "JOIN_TOKEN": "#gameJoinTokenField"
    };

    script.actions = {
        openGamePopup: function () {
            $("#gameInitPopupContainer").show();
            $("#gameInitNameField").focus();
        },
        closeGamePopup: function () {
            $("#gameInitPopupContainer").hide();
        },
        closeJoinGamePopup: function () {
            $("#gameJoinPopupContainer").hide();
        },
        processInitGame: function () {
            var username = $("#gameInitNameField").val();
            if (username) {
                console.log("Starting Game...");
                script.socket.emit("newGameRequest", username);
            }
            //script.actions.closeGamePopup();
        },
        processJoinGame: function () {
            var roomId = $("#gameJoinTokenField").val();
            var username = $("#gameJoinNameField").val();
            if (roomId) {
                console.log("Joining a Room...");
                script.socket.emit("joinGame", {token: roomId, name:username});
            }
            script.actions.closeJoinGamePopup();
        },
        openJoinGamePopup: function () {
            $("#gameJoinPopupContainer").show();
            $("#gameJoinNameField").focus();
        },
        showRoomToken: function (roomId) {
            $("#gameTokenField").val(roomId);
            $("#waitingForUsersPopup").show();
            $("#gameInitPopup").hide();
            $("#gameTokenField").select();
        }
    };

    script.socketInitialize = function () {
        script.socket = io.connect('http://localhost:8000');

        script.socket.on("gameInitiated", function (resp) {
            console.log(resp);
            script.roomData = script.roomData || {};
            script.roomData.currentRoom = resp.roomId;
            script.actions.showRoomToken(resp.roomId);
        });

        script.socket.on("newPlayerJoined", function (data) {
            console.log(data);
        });

        script.socket.on("joinedGame", function (data) {
            console.log(data);
        });
    };

    script.initializeMessaging = function(){
        var number = $("#phoneNumber").val();
        if(number){
            script.socket.emit("sendMessageInvite", number)
        }
    };

    script.bindEventHandlers = function () {
        $("#initGame").on("click", script.actions.openGamePopup);
        $("#joinAGame").on("click", script.actions.openJoinGamePopup);
        $("#gameSubmit").on("click", script.actions.processInitGame);
        $("#gameJoinSubmit").on("click", script.actions.processJoinGame);
        $("#cancelJoinGameSubmit").on("click", script.actions.closeJoinGamePopup);
        $("#cancelGameSubmit").on("click", script.actions.closeGamePopup);
    };

    script.constructor = function () {
        script.bindEventHandlers();
        script.socketInitialize();
        script.initializeTwilio();
    };

    script.init = function () {
        $(document).on("ready", function () {
            script.constructor();
        })
    };
    return script;
})();

script.init();