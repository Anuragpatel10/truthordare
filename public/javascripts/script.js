var script = (function () {
    var script = {};
    script.game = {};

    script.domElementsEnum = {
        "GAME_ID": "#gameRoomId",
        "USER_NAME": "#gameInitNameField",
        "JOIN_USERNAME": "#gameJoinNameField",
        "JOIN_TOKEN": "#gameJoinTokenField"
    };

    script.game.regions = [
        { min: 334, max: 36 },
        { min: 37, max: 109 },
        { min: 110, max: 182 },
        { min: 183, max: 255 },
        { min: 256, max: 333 }
    ];

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
                script.socket.emit("sendMessageInvite", {
                    number: number, 
                    token : script.roomData.currentRoom, 
                    initiator: script.roomData.initiator
                });
            }
        },
        getTemplates: function () {
            script.templates = {};
            script.templates.gameTemplate = $("#gamePageWrapper")[0].outerHTML;
            script.templates.onlineUserTemplate = $("#onlineUserTemplate").html();
            script.templates.chatMessageTemplate = $("#chatMessageTemplate").html();
            $("#gamePageWrapper").remove();
            $("#onlineUserTemplate").remove();
            $("#chatMessageTemplate").remove();
        },
        startGame: function () {
            script.actions.closeJoinGamePopup();
            script.actions.closeGamePopup();
            
            $("#content").fadeOut("slow", function () {
                $(this).remove();
            });

            if (!$("#header").siblings("#gamePageWrapper").length) {
                $("#header").after(script.templates.gameTemplate);
                script.bindEventHandlers();
            }
        },
        getUsersInRoom: function () {
            if (script.roomData && script.roomData.currentRoom) {
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
            if (script.roomData.users) {
                var i = 0;
                $("#online-users").empty();
                script.roomData.users.forEach(function (user, idx) {
                    if (user.name == script.roomData.initiator) {
                        $("#videoMe").attr("data-user", user.name);
                    } else {
                        var $el = $("#video" + (i + 1));
                        if ($el && !$el.attr("data-user")) {
                            $el.attr("data-user", user.name);
                            var userEl = $(script.templates.onlineUserTemplate);
                            userEl.find(".info").eq(0).html(user.name);
                            $("#online-users").append(userEl[0].outerHTML);
                        }
                        i++;
                    }
                });
            }
        },
        getPointedVideo: function (angle) {
            var activeVideo = 1;
            if(script.roomData && script.roomData.users) {
                script.game.regions.forEach(function (region, idx) {
                    if(angle >= region.min && angle <= region.max) {
                        activeVideo = idx+1;
                        return false;
                    }
                    if(idx == 0 && (angle <= region.min && angle >= region.max)) {
                        activeVideo = 1;
                        return false;
                    }
                });
            }
            return activeVideo;
        },
        bottleHandler: function () {
            var angle = 0;
            $el = $("#bottle");
            if(script.game.spinAngle) {
                angle = script.game.spinAngle;
            }
            var quadrant = Math.random() * 4;
            var newSpinAngle = ((Math.random() * 150) * quadrant) + (360*4) + angle;
            script.game.spinAngle = newSpinAngle;
            script.socket.emit("bottleSpinAmount", {angle: newSpinAngle, quadrant: quadrant});
            $el.css({
                transform: "rotate(" + Math.floor(newSpinAngle) + "deg)",
            });
            setTimeout(function () {
                var activeVideo = script.actions.getPointedVideo(newSpinAngle%360);
                if(activeVideo > 0) {
                    $("#game-container>video").removeClass("active").eq(activeVideo).addClass("active");
                }
            }, 3000);
        },
        spinBottle: function (data) {
            if(script.game.spinAngle) {
                script.game.spinAngle = data.angle;
            }
            $("#bottle").css({
                transform: "rotate(" + Math.floor(data.angle) + "deg)",
            });
            setTimeout(function () {
                var activeVideo = script.actions.getPointedVideo(data.angle%360);
                if(activeVideo > 0) {
                    $("#game-container>video").removeClass("active").eq(activeVideo).addClass("active");
                }
            }, 3000);
        },
        sendChatMessage: function (e) {
            if(e.which == 13) {
                var message = $(this).val();
                console.log(message);
                if (message) {
                    script.socket.emit("chat", {
                        token: script.roomData.currentRoom, 
                        message: message, 
                        sender: script.roomData.initiator, 
                        pictureData: script.currentUserPicData
                    });
                }
            }
        },
        takePictureOfCurrentUser: function () {
            var video = document.querySelector('#videoMe');
            var canvas = document.querySelector('#canvas');
            // var photo = document.querySelector('#photo');
            var width = $("#videoMe").width();
            var height = $("#videoMe").height();
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(video, 0, 0, width, height);
            script.currentUserPicData = canvas.toDataURL('image/png');
            // photo.setAttribute('src', script.currentUserPicData);
        }
    };

    script.socketInitialize = function () {
        script.socket = io.connect('http://10.1.1.18:8000');

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
            setTimeout(function(){
                script.actions.takePictureOfCurrentUser();
            }, 5000);
        });
        script.socket.on("bottleSpinAmountResponse", function (data) {
            script.actions.spinBottle(data);
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
            if (data.length) {
                script.roomData.users = data;
                script.actions.populateDataAndStream();
            }
        });

        script.socket.on("inviteResponse", function (data) {
            if (data.error) {
                console.log("Sorry! couldn't send the message! Try Again");
            } else {
                console.log("Message Successfully Sent!");
                $("#phoneNumber").val("");
            }
        });

        script.socket.on("chat", function (data) {
            console.log(data);
            var $el = $(script.templates.chatMessageTemplate);
            $el.find("img").attr("src", data.pictureData).addClass(JSON.stringify(data.sender));
            $el.find("span.name").html(data.sender);
            $el.find("p").html(data.message);
            console.log($el);
            if(data.sender == script.roomData.initiator) {
                $el.addClass("me");
                $("#chatTextBox").val("");
            }
            $("#chatWindow .messages").append($el.hide().fadeIn(800)).scrollTop($('#chatWindow .messages')[0].scrollHeight);
        });
    };

    script.bindEventHandlers = function () {
        $("#initGame").off("click").on("click", script.actions.openGamePopup);
        $("#joinAGame").off("click").on("click", script.actions.openJoinGamePopup);
        $("#gameSubmit").off("click").on("click", script.actions.processInitGame);
        $("#gameJoinSubmit").off("click").on("click", script.actions.processJoinGame);
        $("#cancelJoinGameSubmit").off("click").on("click", script.actions.closeJoinGamePopup);
        $("#cancelGameSubmit").off("click").on("click", script.actions.closeGamePopup);
        $("#inviteButton").off("click").on("click", script.actions.sendMessage);
        $("#bottle").off("click").on("click", script.actions.bottleHandler);
        $("#chatTextBox").off("keyup").on("keyup", script.actions.sendChatMessage);
    };

    script.rtcInitialize = function () {
        if (!script.webrtc) {
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