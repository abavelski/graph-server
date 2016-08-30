var http = require('http');
var csv = require('csv');

var compare = function(a,b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;

    return 0;
    };


module.exports = function(opt, cb) {

  opt.symbol = opt.symbol.replace('+', '.');

  var transformData = function(data) {
    var resp = [];
      for (var i=1;i<data.length; i++) {
          resp.push([
              new Date(data[i][0]).getTime(),
              Math.round(parseFloat(data[i][1]) * 100) / 100,
              Math.round(parseFloat(data[i][2]) * 100) / 100,
              Math.round(parseFloat(data[i][3]) * 100) / 100,
              Math.round(parseFloat(data[i][4]) * 100) / 100,
              parseInt(data[i][5]),
              Math.round(parseFloat(data[i][6]) * 100) / 100
          ]);
      }

      resp.sort(compare);
      cb(null, resp);
  };

    var url = "http://ichart.yahoo.com/table.csv?s="+opt.symbol+"&g="+opt.period;
    if (opt.from) {
        url+='&a='+opt.from.getMonth()+'&b='+opt.from.getUTCDate()+'&c='+opt.from.getUTCFullYear();
    }
    if (opt.to) {
        url+='&d='+opt.to.getMonth()+'&e='+opt.to.getUTCDate()+'&f='+opt.to.getUTCFullYear();
    }
    url+='&ignore=.csv';

    var proxy = {
          host: "osia",
          port: 3128,
          path: url,
          headers: {
            Host: "ichart.yahoo.com"
          }
    };
    http.get(url, function(res) {

        if ( res.statusCode!==200) {
            cb(Error("Error: "+res.statusCode));
        } else {
          csv().from.stream(res).to.array(transformData);
        }
    }).on('error', function(e) {
            cb(e);
        });
};
