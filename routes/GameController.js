
exports.start = function(req, res){
    GameService.start(req.body)
        .on("error", function(){

        })
        .on("gameStarted", function(){

        });
};