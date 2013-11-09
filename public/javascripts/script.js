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
        },
        startARoom: function(){
            console.log("Starting Game...");
            script.socket.emit("id");
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