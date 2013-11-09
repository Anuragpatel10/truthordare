var script  = (function(){
    var script = {};

    script.domElementsEnum = {
        "GAME_ID" : "#gameRoomId"
    };

    script.actions = {
        joinARoom: function(){
            var roomId = $(script.domElementsEnum.GAME_ID).val();
            console.log("Joining a Room...");
            if(roomId){
                script.socket.emit("joinGame", roomId);
            }
            $("#gameJoinPopupContainer").show();
            $("#gameJoinNameField").focus();
        },
        startARoom: function(){
            console.log("Starting Game...");
            script.socket.emit("id");
        },
        openGamePopup: function(){
            $("#gameInitPopupContainer").show();
            $("#gameInitNameField").focus();
        },
        closeGamePopup: function(){
            $("#gameInitPopupContainer").hide();
        },
        closeJoinGamePopup: function(){
            $("#gameJoinPopupContainer").hide();
        },
        processInitGame: function(){
            script.actions.closeGamePopup();
        },
        processJoinGame: function(){
            script.actions.closeJoinGamePopup();
        },
        openJoinGamePopup: function(){
            $("#gameInitPopupContainer").show();
            $("#gameInitNameField").focus();
        }
    };

    script.socketInitialize = function(){
        script.socket = io.connect('http://localhost:8000');

        script.socket.on("gameInitiated", function(roomId){
            console.log(roomId);
        });
    };

    script.bindEventHandlers = function(){
        $("#startAGame").on("click", script.actions.startARoom);
        $("#joinAGame").on("click", script.actions.joinARoom);
        $("#initGame").on("click", script.actions.openGamePopup);
        $("#gameSubmit").on("click", script.actions.processInitGame);
        $("#cancelGameSubmit").on("click", script.actions.closeGamePopup);
        $("#gameJoinSubmit").on("click", script.actions.processJoinGame);
        $("#cancelJoinGameSubmit").on("click", script.actions.closeJoinGamePopup);
    };

    script.constructor = function(){
        script.bindEventHandlers();
        script.socketInitialize();
    };

    script.init = function(){
        $(document).on("ready", function(){
            script.constructor();
        })
    };
    return script;
})();

script.init();