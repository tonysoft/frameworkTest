var dirPaths = require(process.cwd() + '/server/config/dirPaths');
var Measurment = require(dirPaths.modelsDir + 'Measurment');
var CCC = require(dirPaths.modelsDir + 'CCC');
var eqcccController = {
  getCCC: function(req, res) {
    var html = 'GET : Find Customer / Cage / Cabinet measurements for a Time Period ';
    res.send(html);
  },
  getAll: function(req, res) {
    var html = 'GET : Find ALL Customer / Cage / Cabinet measurements ';
    res.send(html);
  },
  deleteAll: function(req, res) {
    var html = 'DELETE : Remove ALL Customer / Cage / Cabinet measurements ';
    res.send(html);
  }
}
module.exports = eqcccController;