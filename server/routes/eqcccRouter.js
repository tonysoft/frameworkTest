var eqcccRouter = function(app) {
  var eqcccController = require(path.join(dirPaths.controllersDir, 'eqcccController'));
  app.get('/ccc/:timePeriod/:customer/:cage/:cabinet', eqcccController.getCCC);
  app.get('/ccc', eqcccController.getAll);
  app.delete('/ccc/:id', eqcccController.deleteByID);
}
module.exports = eqcccRouter;