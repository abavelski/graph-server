
var stockHistory = require("./stockHistory");
var intraday = require("./intraday");


module.exports = function(router) {

router.route('/api/history/:symbol').get(function(req, res) {
	var period = req.query.period;
	var symbol = req.params.symbol;
	if (!period) {
		period = '1y'
	}

	if (period==='1d' || period==='1w') {
		if (period==='1w') period='7d';
		intraday({period: period, symbol: symbol}, function(err, data) {
			if (err) {
				res.status(500).json({error: 'Internal error'}).end();
			} else {
				res.json({
					period: period,
					points : data
				}).end();
			}

	});
	} else {
		var granularity = 'd';
		var startDate = new Date();
		if (period==='1y') {
				startDate.setFullYear(startDate.getFullYear()-1);
		} else if (period==='5y') {
				startDate.setFullYear(startDate.getFullYear()-5);
				granularity = 'w';
		} else if (period==='all') {
				startDate.setFullYear(startDate.getFullYear()-30);
				granularity = 'm';
		} else if (period==='1m') {
				startDate.setMonth(startDate.getMonth()-1);
		} else if (period==='3m') {
				startDate.setMonth(startDate.getMonth()-3);
		} else if (period==='6m') {
				startDate.setMonth(startDate.getMonth()-6);
		} else if (period==='ytd') {
				startDate.setFullYear(new Date().getFullYear(), 0, 1)
		}

		stockHistory({
			from: startDate,
			to: new Date(),
			period: granularity,
			symbol: symbol
			}, function(err, data) {
				if (err) {
					res.status(500).json({error: 'Internal error'}).end();
				} else {
					res.json({
						period: period,
						points : data
					}).end();
				}

		});
	}




});

};
