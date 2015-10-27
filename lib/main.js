'use strict';

const readline = require('readline');
const Parser = require('./parser');
const data = {
	es6: require('../data/data-es6')
};

const Table = require('cli-table');

let multipleResultsPrompt = (rl, tests, cb) => {
	rl.question('Option: ', (answer) => {
		let name = tests[parseInt(answer, 10) - 1];

		if (!name) {
			console.log(`Invalid option: ${answer}`);
			return multipleResultsPrompt(rl, tests, cb);
		};

		return cb(name);
	});
}

let getSummary = ({ browsers, subtests }) => {
	let summary = subtests.reduce((results, subtest) => {
		Object.keys(subtest.res).forEach((key) => {
			results[key] = results[key] || 0;
			if (subtest.res[key] === true) results[key] += 1;
		});
		return results;
	}, {});

	return Object.keys(summary).sort().map((browser) => {
		return [`${browsers[browser].full} [${browsers[browser].short}]`, `${summary[browser]}/${subtests.length}`];
	});
}

let printSummary = (data) => {
	let table = new Table({
	    head: ['Browser', 'Compatibility'],
		colWidths: [80, 15]
	});

	data.forEach((entry) => {
		table.push(entry);
	});

	console.log(table.toString());
}

module.exports = (argv) => {
    let parser = new Parser(data[argv.spec]);
    let name = argv._[0];
    let tests = parser.findTests(name);

	// TODO: Write separate print interface (including one common layout)

	if (!tests.length) {
		console.log(`No results found for: ${name}`);
	} else if (tests.length === 1) {
		console.log(`Print results for: ${name}`);
		printSummary(getSummary({
			browsers: parser.getBrowsers(),
			subtests: parser.getSubtests(tests[0])
		}));
	} else {
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		console.log('\nMultiple results found. Please select one of the options:\n');
		tests.forEach((test, index) => { console.log((index + 1) + ': ' + test); })
		console.log('');

		let test = multipleResultsPrompt(rl, tests, (name) => {
			console.log(`\nSelected option: ${name}\n`);

			printSummary(getSummary({
				browsers: parser.getBrowsers(),
				subtests: parser.getSubtests(name)
			}));

			rl.close();
		});
	}
}
