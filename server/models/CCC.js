var Waterline = require('waterline');
var CCC = Waterline.Collection.extend({
  adapter: 'mongo',
  connection: 'mongo',
  schema: false,
  identity: 'ccc',
  attributes: {
    aggregatedCount: {
      type: 'string'
    },
    rawCount: {
      type: 'string'
    },
    tags: {
      type: 'array'
    }
  }
});

module.exports = CCC;