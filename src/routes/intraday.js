var http = require('http');
var csv = require('csv');

var compare = function(a,b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
    };

module.exports = function(opt, cb) {
  var transformData = function(data) {
    var resp = [];
      for (var i=1;i<data.length; i++) {
        if (data[i].length!==6 || Number.isNaN(parseInt(data[i][0]))) continue;

          resp.push([
              parseInt(data[i][0]*1000),
              Math.round(parseFloat(data[i][4]) * 100) / 100,
              Math.round(parseFloat(data[i][2]) * 100) / 100,
              Math.round(parseFloat(data[i][3]) * 100) / 100,
              Math.round(parseFloat(data[i][1]) * 100) / 100,
              parseInt(data[i][5])
              ]);
      }
      resp.sort(compare);
      cb(null, resp);
  };

    var url = "http://chartapi.finance.yahoo.com/instrument/7.0/"+opt.symbol+"/chartdata;type=quote;range="+opt.period+"/csv"

    var proxy = {
          host: "osia",
          port: 3128,
          path: url
    };
    http.get(proxy, function(res) {

        if ( res.statusCode!==200) {
            cb(Error("Error: "+res.statusCode));
        } else {
          csv().from.stream(res).to.array(transformData);
        }
    }).on('error', function(e) {
            cb(e);
        });
};
