'use strict';

const Table = require('cli-table');
const chalk = require('chalk');

let printSummary = (data) => {
	let table = new Table({
		chars: {
			'top': '',
			'top-mid': '',
			'top-left': '',
			'top-right': '',
			'bottom': '',
			'bottom-mid': '',
			'bottom-left': '',
			'bottom-right': '',
			'left': '',
			'left-mid': '',
			'right': '',
			'right-mid': '',
			'mid': '' ,
			'mid-mid': '',
			'middle': ''
		},
		style: {
			'padding-left': 0,
			'padding-right': 0,
			'head': []
		},
	    head: ['Browser', 'Compatibility'],
		colWidths: [45, 15],
		colAligns: ['left', 'right']
	});

	table.push(['', '']);

	data.forEach((entry) => {
		let val = parseFloat(entry[1][0] / entry[1][1]);
		let str = entry[1][0] / entry[1][1] * 100 + '% ' + '[' + entry[1][0] + '/' + entry[1][1] + ']';

		if (val < 0.4) {
			entry[0] = chalk.red(entry[0]);
			entry[1] = chalk.red(str);
		} else if (val < 0.8) {
			entry[0] = chalk.yellow(entry[0]);
			entry[1] = chalk.yellow(str);
		} else {
			entry[0] = chalk.green(entry[0]);
			entry[1] = chalk.green(str);
		}

		table.push(entry);
	});

	console.log(table.toString()+ '\n');
}

module.exports = { printSummary }
