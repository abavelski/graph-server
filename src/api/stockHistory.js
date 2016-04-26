var http = require('http');
var csv = require('csv');

var StockHistory = function() {
    'use strict';
    var self = this;
    var period = "d";
    var symbol = "YHOO";
    var from, to;
    var myCallback = function(data) {
        console.log(data);
    };

    self.daily = function() {
        period = "d";
        return self;
    };

    self.weekly = function() {
        period = "w";
        return self;
    };

    self.monthly = function() {
        period = "m";
        return self;
    };

    self.dividendsOnly = function() {
        period = "v";
        return self;
    };

    self.forSymbol = function(mySymbol) {
        symbol = mySymbol;
        return self;
    };


    self.from = function(fromDate) {
        if (typeof fromDate === 'string') {
            from = new Date(fromDate);
        } else {
            from = fromDate;
        }
        return self;
    };

    self.to = function(toDate) {
        if (typeof toDate == 'string') {
            to = new Date(toDate);
        } else {
            to = toDate;
        }
        return self;
    };

    var compare = function(a,b) {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;

        return 0;
        };

    var transformData = function(data) {
        if (period==='v') {
            console.log(data);
            return;
        }
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
        myCallback(null, resp);
    };

    self.getHistory = function(callback) {
        console.log('getHistory');
        var url = "http://ichart.yahoo.com/table.csv?s="+symbol+"&g="+period;
        if (from) {
            url+='&a='+from.getMonth()+'&b='+from.getUTCDate()+'&c='+from.getUTCFullYear();
        }
        if (to) {
            url+='&d='+to.getMonth()+'&e='+to.getUTCDate()+'&f='+to.getUTCFullYear();
        }
        url+='&ignore=.csv';
        console.log('URL:'+url);
        if (callback) {
            myCallback = callback;
        }
        var options = {
              host: "osia",
              port: 3128,
              path: url,
              headers: {
                Host: "ichart.yahoo.com"
              }
        };
        http.get(options, function(res) {
            console.log('response received');
            if ( res.statusCode!==200) {
                myCallback(Error("Error: "+res.statusCode));
            } else {
              csv().from.stream(res).to.array(transformData);
            }
        }).on('error', function(e) {
                myCallback(e);
            });
    };

};

module.exports = new StockHistory();
