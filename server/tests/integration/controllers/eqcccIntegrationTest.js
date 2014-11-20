var hippie = require('hippie');

describe('API Integration Tests for GET Operation', function() {

  it('GET /users should return 200', function() {
    hippie()
      .header("User-Agent", "hippie")
      .json()
      .get('http://localhost:8090//ccc/:timePeriod/{customer}/{cage}/{cabinet}')
      .expectStatus(200)
      .end(function(err, res, body) {
        if (err) throw err;
      });
  });

});