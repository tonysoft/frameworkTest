var dirPaths = require(process.cwd() + '/server/config/dirPaths');
var Application = require(dirPaths.modelsDir + 'Application');
var Application2 = require(dirPaths.modelsDir + 'Application2');
var sampleController = {
  getApp: function(req, res) {
    var html = 'GET : Login with username and password ';
    res.send(html);
  },
  postApp: function(req, res) {
    var html = 'POST : Register new application ';
    res.send(html);
  }
}
module.exports = sampleController;