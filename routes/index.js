// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('Wg9lXT8VXspD5C-9');
/*
 * GET home page.
 */

exports.index = function(req, res){
    var voteko = '<iframe src="http://nodeknockout.com/iframe/team-ninja" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>';
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<html><body>' + voteko + '</body></html>\n');
};