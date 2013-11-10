var script = (function () {
    var script = {};

    script.domElementsEnum = {
        "GAME_ID": "#gameRoomId",
        "USER_NAME": "#gameInitNameField",
        "JOIN_USERNAME": "#gameJoinNameField",
        "JOIN_TOKEN": "#gameJoinTokenField"
    };

    script.actions = {
        resetPopupFields: function () {
            $("#gameJoinTokenField").val("");
            $("#gameJoinNameField").val("");
            $("#gameInitNameField").val("");
            $("#gameTokenField").val("");
            $("#phoneNumber").val("");
        },
        openGamePopup: function () {
            $("#gameInitPopupContainer").show();
            $("#gameInitNameField").focus();
        },
        closeGamePopup: function () {
            script.actions.resetPopupFields();
            $("#gameInitPopupContainer").hide();
        },
        closeJoinGamePopup: function () {
            script.actions.resetPopupFields();
            $("#gameJoinPopupContainer").hide();
        },
        processInitGame: function () {
            var username = $("#gameInitNameField").val();
            if (username) {
                script.socket.emit("newGameRequest", username);
            }
        },
        processJoinGame: function () {
            var roomId = $("#gameJoinTokenField").val();
            var username = $("#gameJoinNameField").val();
            if (roomId) {
                script.socket.emit("joinGame", {token: roomId, name: username});
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
        },
        sendMessage: function () {
            var number = $("#phoneNumber").val();
            if (number) {
                script.socket.emit("sendMessageInvite", {number: number, token : script.roomData.currentRoom, initiator: script.roomData.initiator});
            }
        },
        getTemplates: function () {
            script.templates = {};
            script.templates.gameTemplate = $("#gamePageWrapper")[0].outerHTML;
            script.templates.onlineUserTemplate = $("#onlineUserTemplate").html();
            $("#gamePageWrapper").remove();
            $("#onlineUserTemplate").remove();
        },
        startGame: function () {
            script.actions.closeJoinGamePopup();
            script.actions.closeGamePopup();

            $("#content").fadeOut("slow", function () {
                $(this).remove();
            });

            if( ! $("#header").siblings("#gamePageWrapper").length) {
                $("#header").after(script.templates.gameTemplate);
            }
        },
        getUsersInRoom: function () {
            if(script.roomData && script.roomData.currentRoom) {
                script.socket.emit("getUsersInRoom", script.roomData.currentRoom);
            }
        },
        handleRoomFull: function (data) {
            script.actions.closeGamePopup();
            script.actions.closeJoinGamePopup();
            alert("Hey " + data.name + ", the game you are trying to join is currently full, you may wait or start a new game.");
            script.actions.openGamePopup();
        },
        populateDataAndStream: function () {
            if(script.roomData.users) {
                var i = 0;
                $("#online-users").empty();
                script.roomData.users.forEach(function(user, idx) {
                    if(user.name == script.roomData.initiator) {
                        $("#videoMe").attr("data-user", user.name);
                    } else {
                        var $el = $("#video" + (i+1));
                        if($el && !$el.attr("data-user")) {
                            $el.attr("data-user", user.name);
                            var userEl = $(script.templates.onlineUserTemplate);
                            userEl.find(".info").eq(0).html(user.name);
                            $("#online-users").append(userEl[0].outerHTML);
                        }
                        i++;
                    }
                });
            }
        }
    };

    script.socketInitialize = function () {
        script.socket = io.connect('http://10.1.1.69:8000');

        script.socket.on("gameInitiated", function (resp) {
            script.roomData = script.roomData || {};
            script.roomData.currentRoom = resp.roomId;
            script.roomData.initiator = resp.name;
            script.actions.showRoomToken(resp.roomId);
        });
        script.socket.on("newPlayerJoined", function (data) {
            script.actions.startGame();
            script.actions.getUsersInRoom();
            script.rtcInitialize();
            script.webrtc.on('readyToCall', function () {
                console.log("Joined the room", script.roomData.currentRoom);
                script.webrtc.joinRoom(script.roomData.currentRoom);
            });
        });
        script.socket.on("roomFull", function (data) {
            script.actions.handleRoomFull(data);
        });
        script.socket.on("joinedGame", function (data) {
            script.roomData = script.roomData || {};
            script.roomData.initiator = data.name;
            script.roomData.currentRoom = data.token;
            script.actions.getUsersInRoom();
        });

        script.socket.on("usersInRoomResponse", function (data) {
            script.roomData = script.roomData || {};
            if(data.length) {
                script.roomData.users = data;
                script.actions.populateDataAndStream();
            }
        });

        script.socket.on("inviteResponse", function (data){
            if(data.error){
                console.log("Sorry! couldn't send the message! Try Again");
            } else {
                console.log("Message Successfully Sent!");
                $("#phoneNumber").val("");
            }
        })
    };

    script.bindEventHandlers = function () {
        $("#initGame").on("click", script.actions.openGamePopup);
        $("#joinAGame").on("click", script.actions.openJoinGamePopup);
        $("#gameSubmit").on("click", script.actions.processInitGame);
        $("#gameJoinSubmit").on("click", script.actions.processJoinGame);
        $("#cancelJoinGameSubmit").on("click", script.actions.closeJoinGamePopup);
        $("#cancelGameSubmit").on("click", script.actions.closeGamePopup);
        $("#inviteButton").on("click", script.actions.sendMessage);
    };

    script.rtcInitialize = function(){
        if(!script.webrtc) {
            script.webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'videoMe',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'game-container',
                // immediately ask for camera access
                autoRequestMedia: true
            });
        }
    };

    script.constructor = function () {
        script.bindEventHandlers();
        script.socketInitialize();
        script.actions.getTemplates();
    };

    script.init = function () {
        $(document).on("ready", function () {
            script.constructor();
        })
    };
    return script;
})();

script.init();