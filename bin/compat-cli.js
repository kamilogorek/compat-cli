#!/usr/bin/env node

'use strict';

const DEFAULT_SPEC = 'es6';
const argv = require('yargs')
    .usage('Usage: $0 <name> [options]')
    .demand(1)
    .describe('beast-mode', 'Put additional 45lbs plates per side if doing back squats')
    .example('$0 rest', 'Verify \`rest\` API compatibility')
    .help('h')
    .alias('h', 'help')
    .argv;

argv.spec = DEFAULT_SPEC;

require('../lib/main')(argv);
