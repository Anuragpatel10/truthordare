
exports.start = function(req, res){
    GameService.start(req.body)
        .on("error", function(){

        })
        .on("gameInitiated", function(id){
            console.log(id);
        });
};
