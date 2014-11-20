var sinon = require('sinon'),
  chai = require('chai').use(require('sinon-chai')),
  expect = chai.expect,
  dirPaths = require(process.cwd() + '/server/config/dirPaths'),
  Measurment = require(dirPaths.modelsDir + 'Measurment');

var Controller = require('../../controllers/eqcccController.js');
var Model = Measurment;

describe('API Unit Tests for POST Operation', function() {

  it('GET /users should return 200', function() {
    var spy = sinon.spy();
    Controller.get(null, {
      send: spy
    });
    expect(spy).called;
  });

});