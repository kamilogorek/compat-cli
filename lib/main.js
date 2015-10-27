'use strict';

const readline = require('readline');
const Parser = require('./parser');
const data = {
	es6: require('../data/data-es6')
};

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

module.exports = (argv) => {
    let parser = new Parser(data[argv.spec]);
    let name = argv._[0];
    let tests = parser.findTests(name);

	// console.log(tests);
	// return;

	// TODO: Write separate print interface (including one common layout)

	if (!tests.length) {
		console.log(`No results found for: ${name}`);
	} else if (tests.length === 1) {
		console.log(`Print results for: ${name}`);
	} else {
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		console.log('\nMultiple found. Please select one of the options:\n');
		tests.forEach((test, index) => { console.log((index + 1) + ': ' + test); })
		console.log('');

		let test = multipleResultsPrompt(rl, tests, (name) => {
			console.log(`\nSelected option: ${name}`);

			console.log(parser.getTest(name));
			// rl.close();
		});
	}
}
