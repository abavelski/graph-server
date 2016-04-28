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
	var period = req.query.period;
	var symbol = req.params.symbol;
	if (!period) {
		period = '1y'
	}
	var startDate = new Date();

	var history = stockHistory.forSymbol(symbol);
	if (period==='1y') {
			startDate.setFullYear(startDate.getFullYear()-1);
			history = history.from(startDate).to(new Date()).daily();
	} else if (period==='5y') {
			startDate.setFullYear(startDate.getFullYear()-5);
			history = history.from(startDate).to(new Date()).weekly();
	} else if (period==='all') {
			startDate.setFullYear(startDate.getFullYear()-10);
			history = history.from(startDate).to(new Date()).monthly();
	} else if (period==='1m') {
			startDate.setMonth(startDate.getMonth()-1);
			history = history.from(startDate).to(new Date()).daily();
	} else if (period==='3m') {
			startDate.setMonth(startDate.getMonth()-3);
			history = history.from(startDate).to(new Date()).daily();
	} else if (period==='6m') {
			startDate.setMonth(startDate.getMonth()-6);
			history = history.from(startDate).to(new Date()).daily();
	}

	history.getHistory(function(err, data){
			if (err) {
				res.status(500).json({error: 'Internal error'}).end();
			} else {
				res.json({
					period: period,
					points : data
				}).end();
			}

	});
});

};
