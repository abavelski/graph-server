'use strict';
var stockInfo = require("../api/stockInfo");
var stockHistory = require("../api/stockHistory");


module.exports = function(router) {

router.route('/api/companies/:symbol').get(function(req, res){
	stockInfo.forSymbols([req.params.symbol])
		//.withFields(config.fields.details)
		.getStocks()
		.then(function(data){
				res.json(data[0]);
			},
			function() {
				res.send(500).end();
			});
});

router.route('/api/history/:symbol').get(function(req, res) {
	var startDate = new Date();
	startDate.setFullYear(startDate.getFullYear()-1);

	stockHistory.forSymbol(req.params.symbol)
		.from(startDate).to(new Date()).getHistory(function(err, data){
			if (err) {
				res.status(500).json({error: 'Internal error'}).end();
			} else {
				res.json(data).end();
			}

	});
});

};
