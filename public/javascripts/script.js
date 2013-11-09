var script  = (function(){
    var script = {};

    script.actions = {
        joinARoom: function(){
            console.log("Joining a Room...");
        },
        startARoom: function(){
            console.log("Starting Game...");
        }
    };
    script.bindEventHandlers = function(){
        $("#startAGame").on("click", script.actions.startARoom);
        $("#joinAGame").on("click", script.actions.joinARoom);
    };

    script.constructor = function(){
        script.bindEventHandlers();
    };

    script.init = function(){
        $(document).on("ready", function(){
            script.constructor();
        })
    };
    return script;
})();

script.init();