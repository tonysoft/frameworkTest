exports.ping = function() { console.log("sample controller implementation methods go in this module...")};

var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['sv2lxdprep01.corp.equinix.com', 'sv2lxdprep02.corp.equinix.com', 'sv2lxdprep04.corp.equinix.com', 'sv2lxdprep05.corp.equinix.com'], keyspace: 'BCM_KEY_SPACE'});

function writeResponse (response, data, status) {
  response.header('Access-Control-Allow-Origin', "*");
  response.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  response.header("Content-Type", "application/json; charset=utf-8");
  if (status) {
    response.status(status).send(JSON.stringify(data));
  }
  else {
    response.send(JSON.stringify(data));
  }
}

exports.getCCCx = function(req, res) {
    var timePeriod =  req.params.timePeriod;
    var ttimePeriod = "";
    var customer =  req.params.customer;
    var cage =  req.params.cage;
    var cabinet =  req.params.cabinet;
    switch (timePeriod.toLowerCase()) {
        case "hourly":
            ttimePeriod = "CUSTOMER_CABINET_HOURLY_DATA";
            break;
        case "daily":
            ttimePeriod = "CUSTOMER_CABINET_DAILY_DATA";
            break;
        case "monthly":
            ttimePeriod = "CUSTOMER_CABINET_MONTHLY_DATA";
            break;
        default:
            ttimePeriod = undefined;
    }
    
    if (!(ttimePeriod && customer && cage && cabinet)) {
        return renderResults({rows:[]});
    }

    var query = 'select * from "' + ttimePeriod + '"';
    query += " where key= '2014' ";
    query += "and key2 = '" + customer + "' ";
    query += "and key3 = 'TY2' ";
    query += "and key4 = '" + cage + "' ";
    query += "and key5 = '" + cabinet + "' ";
    query += "and column1 >= '20140101' and column1 <= '20141231';";
    client.execute(query, [], function(err, result) {
        renderResults(result);
    });

    function renderResults(resultIn) {
        var result = { rawCount: resultIn.rows.length, aggregatedCount: 0, rows: [] };
        delete result['meta'];
        var row = {};
        resultIn.rows.forEach(function(obj) {
            if (obj.column1 !== row.timestamp) {
                if (row.timestamp) {
                    result.rows.push(row);
                    result.aggregatedCount++;
                }
                row = initRow(obj, row);
            }
            else {
                row = addMeasurement(obj, row);
            }
        });
        function initRow(obj, row) {
            row = {};
            row.customerID = obj.key2;
            row.cageID = obj.key4;
            row.cabinetID = obj.key5;
            row.timestamp = obj.column1;
            row = addMeasurement(obj, row);
            return row;
        }
        function addMeasurement(obj, row) {
            row[obj.column5] = obj.value;
            return row;
        }
        if (row.timestamp) {
            result.rows.push(row);
            result.aggregatedCount++;
        }
        writeResults(result);
    }

    function writeResults(results) {
		writeResponse(res, results, 200);
    }
}