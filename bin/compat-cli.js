#!/usr/bin/env node

'use strict';

const argv = require('yargs')
    .usage('Usage: $0 <name> [options]')
    .demand(1)
    .options({
        'subtests': {
            describe: 'Include subtests in the report',
            type: 'boolean'
        },
        'unstable': {
            describe: 'Include unstable browsers',
            type: 'boolean'
        },
        'obsolete': {
            describe: 'Include obsolete browsers',
            type: 'boolean'
        },
        'spec': {
            default: 'es6',
            describe: 'ECMSScript specification version',
            requiresArg: true,
            choices: ['es5', 'es6', 'es7', 'esintl', 'non-standard']
        },
        'sort-key': {
            default: 'browser',
            describe: 'Sorting key',
            requiresArg: true,
            choices: ['browser', 'score']
        },
        'sort-order': {
            describe: 'Sorting order',
            requiresArg: true,
            choices: ['asc', 'desc']
        }
    })
    .example('$0 rest', 'Verify \`rest\` API compatibility')
    .help('h')
    .alias('h', 'help')
    .argv;

// Just silly mapping. It will be changed if grows too much.
argv.sortOrder = argv['sort-order'] || (argv['sort-key'] === 'score' ? 'desc' : 'asc');
argv.sortKey = argv['sort-key'] === 'score' ? 'result.score' : 'browser.full';

require('../lib/main')(argv);
