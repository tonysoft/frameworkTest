var thisAPImpl = null;
try {
  thisAPImpl = require("../implementation/eqccc");
} catch (e) {
  // No implementation has been provided yet..
  // But that's OK because each end-point defined below will remind us...
}

var eqcccController = {
  getCCC: function(req, res) {
    try {
      return thisAPImpl.getCCC(req, res);
    } catch (e) {
      var html = 'GET : Find Customer / Cage / Cabinet measurements for a Time Period <br/><br/>';
      html += 'exports.<b>.getCCC</b>.(req, res) {...}<br/><br/>';
      html += 'should be exposed from within <b>server/implementation/eqccc.js</b><br/><br/>';
      html += 'you can access <b>app.models[...]</b> to manipulate your data...';
      res.send(html);
    }
  },
  getAll: function(req, res) {
    try {
      return thisAPImpl.getAll(req, res);
    } catch (e) {
      var html = 'GET : Find ALL Customer / Cage / Cabinet measurements <br/><br/>';
      html += 'exports.<b>.getAll</b>.(req, res) {...}<br/><br/>';
      html += 'should be exposed from within <b>server/implementation/eqccc.js</b><br/><br/>';
      html += 'you can access <b>app.models[...]</b> to manipulate your data...';
      res.send(html);
    }
  },
  deleteByID: function(req, res) {
    try {
      return thisAPImpl.deleteByID(req, res);
    } catch (e) {
      var html = 'DELETE : Remove Customer / Cage / Cabinet measurements by ID <br/><br/>';
      html += 'exports.<b>.deleteByID</b>.(req, res) {...}<br/><br/>';
      html += 'should be exposed from within <b>server/implementation/eqccc.js</b><br/><br/>';
      html += 'you can access <b>app.models[...]</b> to manipulate your data...';
      res.send(html);
    }
  }
}
module.exports = eqcccController;