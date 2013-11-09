exports = module.exports = function(app){
    global.app = app;




//    Global Controllers

    global.IndexController = require("../routes/IndexController");
    global.UserController = require("../routes/UserController");
    global.GameController = require("../routes/GameController");


//    Global Services

    global.GameService = require("../services/GameService");
    global.IndexService = require("../services/IndexService");
};