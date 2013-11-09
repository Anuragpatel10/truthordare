
exports.mappings = function(){
    app.get("/", IndexController.index);
    app.post("/startGame", GameController.start);
};