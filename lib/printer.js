'use strict';

const Table = require('cli-table');

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

module.exports = { printSummary }
