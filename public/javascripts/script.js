var script  = (function(){
    var script = {};



    script.constructor = function(){

    };

    script.init = function(){
        $(document).on("ready", function(){
            script.constructor();
        })
    };
    return script;
})();