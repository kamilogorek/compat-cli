'use strict';

const Table = require('cli-table');
const chalk = require('chalk');

let _colorize = (entry) => {
	let colorizedBrowser;
	let colorizedResult;

	let browserTemplate = `${entry.browser.full}: [${entry.browser.short}]`;
	let resultTemplate = `${(entry.result.score / entry.result.total * 100).toFixed(2)}% [${entry.result.score}/${entry.result.total}]`;

	let percentageScore = parseFloat(entry.result.score / entry.result.total);
	if (percentageScore < 0.4) {
		colorizedBrowser = chalk.red(browserTemplate);
		colorizedResult = chalk.red(resultTemplate);
	} else if (percentageScore < 0.8) {
		colorizedBrowser = chalk.yellow(browserTemplate);
		colorizedResult = chalk.yellow(resultTemplate);
	} else {
		colorizedBrowser = chalk.green(browserTemplate);
		colorizedResult = chalk.green(resultTemplate);
	}

	return Object.assign({}, entry, {
		browser: {
			string: colorizedBrowser
		},
		result: {
			string: colorizedResult
		}
	});
}

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
		colWidths: [80, 20],
		colAligns: ['left', 'right']
	});

	table.push(['', '']);
	data.forEach((entry) => {
		let colorizedEntry = _colorize(entry);
		table.push([colorizedEntry.browser.string, colorizedEntry.result.string]);
	});

	console.log(table.toString()+ '\n');
}

module.exports = { printSummary }
