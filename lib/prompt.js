'use strict';

const readline = require('readline');

let multipleResults = (tests, cb) => {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

	rl.question('Option: ', (answer) => {
        rl.close();
        
		let name = tests[parseInt(answer, 10) - 1];

		if (!name) {
			console.log(`Invalid option: ${answer}`);
			return multipleResults(tests, cb);
		};

		return cb(name);
	});
}

module.exports = { multipleResults }
