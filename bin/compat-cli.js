#!/usr/bin/env node

'use strict';

const argv = require('yargs')
    .usage('Usage: $0 <name> [options]')
    .demand(1)
    .options({
        'spec': {
            alias: 's',
            default: 'es6',
            describe: 'ECMSScript specification version',
            requiresArg: true,
            choices: ['es5', 'es6', 'es7', 'esintl', 'non-standard']
        }
    })
    .describe('beast-mode', 'Put additional 45lbs plates per side if doing back squats')
    .example('$0 rest', 'Verify \`rest\` API compatibility')
    .help('h')
    .alias('h', 'help')
    .argv;

require('../lib/main')(argv);
