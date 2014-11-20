var sampleOrigRouter = function(app) {
  var sampleOrigController = require(path.join(dirPaths.controllersDir, 'sampleOrigController'));
  app.get('/application/:appid', sampleOrigController.get);
}
module.exports = sampleOrigRouter;