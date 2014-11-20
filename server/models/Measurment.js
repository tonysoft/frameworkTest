var Waterline = require('waterline');
var Measurment = Waterline.Collection.extend({
  adapter: 'mongo',
  connection: 'mongo',
  schema: false,
  identity: 'measurment',
  attributes: {
    name: {
      type: 'string'
    }
  }
});

module.exports = Measurment;