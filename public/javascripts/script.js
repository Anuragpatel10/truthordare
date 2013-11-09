var script  = (function(){
    var script = {};

    script.domElementsEnum = {
        "GAME_ID" : "#gameRoomId",
        "USER_NAME" : "#gameInitNameField"
    };

    script.actions = {
        joinARoom: function(){
            var roomId = $(script.domElementsEnum.GAME_ID).val();
            if(roomId){
                console.log("Joining a Room...");
                script.socket.emit("joinGame", roomId);
            }
        },
        startARoom: function(){
            var username = $(script.domElementsEnum.USER_NAME).val();
            if(username){
                console.log("Starting Game...");
                script.socket.emit("newGameRequest", username);
            }
        },
        openGamePopup: function(){
            $("#gameInitPopup").show();
        }
    };

    script.socketInitialize = function(){
        script.socket = io.connect('http://localhost:8000');

        script.socket.on("gameInitiated", function(roomId){
            console.log(roomId);
        });

        script.socket.on("newPlayerJoined", function(data){
            console.log(data);
        });

        script.socket.on("joinedGame", function(data){
            console.log(data);
        });
    };

    script.bindEventHandlers = function(){
        $("#startAGame").on("click", script.actions.startARoom);
        $("#joinAGame").on("click", script.actions.joinARoom);
        $("#initGame").on("click", script.actions.openGamePopup);
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