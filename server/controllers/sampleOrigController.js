var dirPaths = require(process.cwd() + '/server/config/dirPaths'),
  Application = require(dirPaths.modelsDir + 'Application');

var sampleOrigController = {
  get: function(req, res) {
    var html = 'GET method of Controller ';
    Application;
    res.send(html);
  },
  post: function(req, res) {
    var html = 'POST method of Controller ';
    Application;
    res.send(html);
  }
}
module.exports = sampleOrigController;