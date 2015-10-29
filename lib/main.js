'use strict';

const _ = require('lodash');
const Parser = require('./parser');
const printer = require('./printer');
const prompt = require('./prompt');

const data = {
	'es5': require('../data/data-es5'),
	'es6': require('../data/data-es6'),
	'es7': require('../data/data-es7'),
	'esintl': require('../data/data-esintl'),
	'non-standard': require('../data/data-non-standard')
};

let sortKey;
let sortOrder;

let _getSummary = ({ browsers, subtests }) => {
	let summary = subtests.reduce((results, subtest) => {
		Object.keys(subtest.res).forEach((key) => {
			results[key] = results[key] || 0;
			if (subtest.res[key] === true) results[key] += 1;
		});
		return results;
	}, {});

	return _.sortByOrder(Object.keys(summary).map((browser) => {
		return {
			browser: {
				full: browsers[browser].full,
				short: browsers[browser].short
			},
			result: {
				score: summary[browser],
				total: subtests.length
			}
		};
	}), [(entry) => {
		let val = _.get(entry, sortKey);
		return _.isString(val) ? val.toLowerCase() : val;
	}], [sortOrder]);
}

module.exports = (argv) => {
	sortKey = argv.sortKey;
	sortOrder = argv.sortOrder;

    let parser = new Parser(data[argv.spec]);
    let name = argv._[0];
    let tests = parser.findTests(name);

	if (!tests.length) {
		console.log(`\nNo results found for: ${name}\n`);
		return;
	}

	if (tests.length === 1) {
		name = tests[0];

		let resultsText = `Results for: ${name}`;
		let separator = Array.from(new Array(resultsText.length), () => '=').join('');

		console.log(`\n${separator}\n${resultsText}\n${separator}\n`);

		let subtests = parser.getSubtests(name);
		let summary = _getSummary({
			browsers: parser.getBrowsers(),
			subtests: subtests.length ? subtests : [parser.getTest(name)]
		});

		printer.printSummary(summary);
	} else {
		console.log('\nMultiple results found. Please select one of the options:\n');
		tests.forEach((test, index) => { console.log((index + 1) + ': ' + test); })
		console.log('');

		let test = prompt.multipleResults(tests, (name) => {
			let resultsText = `Results for: ${name}`;
			let separator = Array.from(new Array(resultsText.length), () => '=').join('');

			console.log(`\n${separator}\n${resultsText}\n${separator}\n`);

			let subtests = parser.getSubtests(name);
			let summary = _getSummary({
				browsers: parser.getBrowsers(),
				subtests: subtests.length ? subtests : [parser.getTest(name)]
			});

			printer.printSummary(summary);
		});
	}
}
