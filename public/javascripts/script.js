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
            //script.actions.closeJoinGamePopup();
        },
        openJoinGamePopup: function () {
            $("#gameJoinPopupContainer").show();
            $("#gameJoinNameField").focus();
        }
    };

    script.socketInitialize = function () {
        script.socket = io.connect('http://10.1.1.69:8000');

        script.socket.on("gameInitiated", function (roomId) {
            console.log(roomId);
        });

        script.socket.on("newPlayerJoined", function (data) {
            console.log(data);
        });

        script.socket.on("joinedGame", function (data) {
            console.log(data);
        });
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
    };

    script.init = function () {
        $(document).on("ready", function () {
            script.constructor();
        })
    };
    return script;
})();

script.init();