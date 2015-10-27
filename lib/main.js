'use strict';

const Parser = require('./parser');
const printer = require('./printer');
const prompt = require('./prompt');

const data = {
	es6: require('../data/data-es6')
};

let getSummary = ({ browsers, subtests }) => {
	let summary = subtests.reduce((results, subtest) => {
		Object.keys(subtest.res).forEach((key) => {
			results[key] = results[key] || 0;
			if (subtest.res[key] === true) results[key] += 1;
		});
		return results;
	}, {});

	return Object.keys(summary).sort().map((browser) => {
		return [
			`${browsers[browser].full} [${browsers[browser].short}]`,
			[summary[browser], subtests.length]
		];
	});
}

module.exports = (argv) => {
    let parser = new Parser(data[argv.spec]);
    let name = argv._[0];
    let tests = parser.findTests(name);

	if (!tests.length) {
		console.log(`No results found for: ${name}`);
	} else if (tests.length === 1) {
		console.log(`Print results for: ${name}`);
		let summary = getSummary({
			browsers: parser.getBrowsers(),
			subtests: parser.getSubtests(tests[0])
		});

		printer.printSummary(summary);
	} else {
		console.log('\nMultiple results found. Please select one of the options:\n');
		tests.forEach((test, index) => { console.log((index + 1) + ': ' + test); })
		console.log('');

		let test = prompt.multipleResults(tests, (name) => {
			console.log(`\nSelected option: ${name}\n`);

			let summary = getSummary({
				browsers: parser.getBrowsers(),
				subtests: parser.getSubtests(name)
			});

			printer.printSummary(summary);
		});
	}
}
