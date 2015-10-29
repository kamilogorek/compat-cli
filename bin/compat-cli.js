#!/usr/bin/env node

'use strict';

const argv = require('yargs')
    .usage('Usage: $0 <name> [options]')
    .demand(1)
    .options({
        'spec': {
            default: 'es6',
            describe: 'ECMSScript specification version',
            requiresArg: true,
            choices: ['es5', 'es6', 'es7', 'esintl', 'non-standard']
        },
        'sort-key': {
            default: 'browser',
            describe: 'Sorting key',
            choices: ['browser', 'score']
        },
        'sort-order': {
            describe: 'Sorting order',
            choices: ['asc', 'desc']
        }
    })
    .describe('beast-mode', 'Put additional 45lbs plates per side if doing back squats')
    .example('$0 rest', 'Verify \`rest\` API compatibility')
    .help('h')
    .alias('h', 'help')
    .argv;

// Just silly mapping. It will be changed if grows too much.
argv.sortOrder = argv['sort-order'] || (argv['sort-key'] === 'score' ? 'desc' : 'asc');
argv.sortKey = argv['sort-key'] === 'score' ? 'result.score' : 'browser.full';

require('../lib/main')(argv);
