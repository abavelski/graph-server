
var stockHistory = require("./stockHistory");
var intraday = require("./intraday");


module.exports = function(router) {

router.route('/api/history/:symbol').get(function(req, res) {
	var ppp = req.query.period;
	var period = ppp;
	var symbol = req.params.symbol;
	if (!period) {
		period = '1y'
	}

	if (period==='1d' || period==='1w') {
		if (period==='1w') period='5d';
		intraday({period: period, symbol: symbol}, function(err, data) {
			if (err) {
				res.status(500).json({error: 'Internal error'}).end();
			} else {
				res.json({
					period: ppp,
					points : data
				}).end();
			}

	});
	} else {
		var granularity = 'd';
		var startDate = new Date();
		if (period==='1y' || period==='1m' || period==='3m' || period==='6m' || period==='ytd') {
				startDate.setFullYear(startDate.getFullYear()-3);
		} else if (period==='3y') {
				startDate.setFullYear(startDate.getFullYear()-5);
				granularity = 'w';
		} else if (period==='all') {
				startDate.setFullYear(startDate.getFullYear()-30);
				granularity = 'm';
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
						granularity: granularity,
						period: ppp,
						points : data
					}).end();
				}

		});
	}




});

};
