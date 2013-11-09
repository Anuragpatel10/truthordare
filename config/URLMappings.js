var app = global.app;
var routes = {
    home: require("../routes/index")
};


exports.mappings = function(){
    app.get("/", routes.home.index);
};