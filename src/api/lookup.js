var https = require('https');

var lookup = function(query, callback)  {
    var request = 'https://s.yimg.com/aq/autoc?query='
        +query+'&region=US&lang=en-US&callback=test';

    https.get(request, function(res) {
        res.setEncoding('utf8');
        if ( res.statusCode!=200) throw new Error("Error: "+res.statusCode);
        var data = "";
        res.on('data', function(chunk){
            data+=chunk;
        });
        res.on('end', function() {
            data = data.substring(5, data.length-2);
            var result = JSON.parse(data);
            callback(null, result.ResultSet.Result);
        });

    }).on('error', function(e) {
            callback(e);
        });

}

module.exports = lookup;
