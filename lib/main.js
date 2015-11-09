'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const request = require('request');
const _ = require('lodash');
const Parser = require('./parser');
const printer = require('./printer');
const prompt = require('./prompt');

let _getData = (spec, update) => {
	if (update) return _fetchData(spec);

	try {
		let data = require(`../data/data-${spec}`);
		let stat = fs.statSync(`./data/data-${spec}.js`);
		console.log(`\n> Using cached data set that has been fetched on ${stat.mtime}`);

		// Notify user that data is pretty old and he should update (after 14 days)
		if (((new Date() - new Date(stat.mtime)) / 1000 / 60 / 60 / 24) > 14) {
			let text = `Your data set for ${spec} spec is over 14 days old. You should use --update flag to fetch fresh one.`;
			let separator = Array.from(new Array(text.length), () => '=').join('');
			console.log(`\n${separator}\n${text}\n${separator}`);
		}

		return data;
	} catch (e) {
		console.log(`\n> Data set for ${spec} spec has not been found.`);
		return _fetchData(spec);
	}
};

let _fetchData = (spec) => {
	console.log(`\n> Fetching fresh data set for ${spec} spec...`);
	return new Promise((resolve, reject) => {
		mkdirp.sync('./data');
		request(`https://raw.githubusercontent.com/kangax/compat-table/gh-pages/data-${spec}.js`, (err, res, body) => {
			if (err) reject(err);

			fs.writeFile(`./data/data-${spec}.js`, body, (err) => {
				if (err) reject(err);
				console.log(`> Successfully fetched new data for ${spec} spec.`);
				resolve(require(`../data/data-${spec}`));
			});
		});
	});
}

let sortKey;
let sortOrder;

let _generateReport = ({ browsers, tests, detailed = false }) => {
	let browsersKeys = Object.keys(browsers);

	let report = tests.reduce((results, test) => {
		Object.keys(test.res).forEach((key) => {
			if (browsersKeys.indexOf(key) === -1) return;
			results[key] = results[key] || 0;
			if (test.res[key] === true) results[key] += 1;
		});
		return results;
	}, {});

	return _.sortByOrder(Object.keys(report).map((browser) => {
		let entry = {
			browser: {
				full: browsers[browser].full,
				short: browsers[browser].short
			},
			result: {
				score: report[browser],
				total: tests.length
			}
		};

		if (detailed) {
			entry.subtests = tests.map((test) => {
				return {
					name: test.name,
					result: test.res[browser] || false
				}
			});
		}

		return entry;
	}), [(entry) => {
		let val = _.get(entry, sortKey);
		return _.isString(val) ? val.toLowerCase() : val;
	}], [sortOrder]);
}

module.exports = async (argv) => {
	sortKey = argv.sortKey;
	sortOrder = argv.sortOrder;

	let data = await _getData([argv.spec], argv.update);
    let parser = new Parser(data);
    let name = argv._[0];
    let tests = parser.findTests(name);

	if (!tests.length) {
		console.log(`\nNo results found for: ${name}\n`);
		return;
	}

	let browsers = parser.getCurrentBrowsers();
	if (argv.unstable) Object.assign(browsers, parser.getUnstableBrowsers());
	if (argv.obsolete) Object.assign(browsers, parser.getObsoleteBrowsers());

	if (tests.length === 1) {
		name = tests[0];

		let resultsText = `Results for: ${name}`;
		let separator = Array.from(new Array(resultsText.length), () => '=').join('');

		console.log(`\n${separator}\n${resultsText}\n${separator}\n`);

		let subtests = parser.getSubtests(name);
		let report = _generateReport({
			browsers: browsers,
			tests: subtests.length ? subtests : [parser.getTest(name)],
			detailed: argv.subtests
		});

		printer.printReport(report);
	} else {
		console.log('\nMultiple results found. Please select one of the options:\n');
		tests.forEach((test, index) => { console.log((index + 1) + ': ' + test); })
		console.log('');

		let test = prompt.multipleResults(tests, (name) => {
			let resultsText = `Results for: ${name}`;
			let separator = Array.from(new Array(resultsText.length), () => '=').join('');

			console.log(`\n${separator}\n${resultsText}\n${separator}\n`);

			let subtests = parser.getSubtests(name);
			let report = _generateReport({
				browsers: browsers,
				tests: subtests.length ? subtests : [parser.getTest(name)],
				detailed: argv.subtests
			});

			printer.printReport(report);
		});
	}
}
