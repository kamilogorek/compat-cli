'use strict';

const Table = require('cli-table');
const chalk = require('chalk');

let _colorizeEntry = (entry) => {
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

let _colorizeSubtest = (subtest) => {
	if (subtest.result === true) {
		subtest.name = chalk.green(`    ${subtest.name}`);
		subtest.result = chalk.green(subtest.result);
	} else if (subtest.result === 'flagged') {
		subtest.name = chalk.yellow(`    ${subtest.name}`);
		subtest.result = chalk.yellow(subtest.result);
	} else {
		subtest.name = chalk.red(`    ${subtest.name}`);
		subtest.result = chalk.red(subtest.result);
	}

	return subtest;
}

let printReport = (data) => {
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
			'padding-right': 0
		},
		colWidths: [80, 20],
		colAligns: ['left', 'right']
	});

	data.forEach((entry) => {
		let colorizedEntry = _colorizeEntry(entry);
		table.push([colorizedEntry.browser.string, colorizedEntry.result.string]);

		if (entry.subtests.length) {
			entry.subtests.forEach((subtest) => {
				let colorizedSubtest = _colorizeSubtest(subtest);
				table.push([colorizedSubtest.name, colorizedSubtest.result]);
			});
			table.push(['', '']);
		}
	});

	console.log(table.toString()+ '\n');
}

module.exports = { printReport }
