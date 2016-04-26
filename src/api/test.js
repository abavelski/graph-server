var stockInfo = require("./stockInfo");
var stockHistory = require("./stockHistory");

stockInfo.getStocks()
		.then(
			function(data){
				console.log('data', data);
			},
			function(err) {
				console.log('error');
			});

stockHistory.getHistory();
