'use strict';

const test = require('tape');
const Parser = require('../lib/parser');
const data = require('./data');

let parser;

test('Create parser', (t) => {
    let parser = new Parser(data);
    t.plan(1);
    t.ok(parser instanceof Parser, 'Created succesfully');
});

test('Feed parser with correct data', (t) => {
    let parser = new Parser(data);
    t.plan(3);
    t.equal(parser.spec, data.name, 'Attach spec name to an instance');
    t.equal(parser.browsers, data.browsers, 'Attach spec browsers to an instance');
    t.equal(parser.tests, data.tests, 'Attach spec tests to an instance');
});

test('Feed parser with incorrect data', (t) => {
    t.plan(1);
    t.throws(new Parser({ random: 'data' }), 'Throw an error');
});

test('Basic methods', (t) => {
    let parser = new Parser(data);
    t.plan(1);
    t.equal(parser.getSpec(), 'ES6', 'Return correct spec name');
});

test('Browsers methods', (t) => {
    let parser = new Parser(data);
    t.plan(4);
    t.equal(Object.keys(parser.getBrowsers()).length, 80, 'Return all browsers');
    t.equal(Object.keys(parser.getCurrentBrowsers()).length, 25, 'Return all modern browsers (!unstable and !obsolete)');
    t.equal(Object.keys(parser.getUnstableBrowsers()).length, 6, 'Return all unstable browsers');
    t.equal(Object.keys(parser.getObsoleteBrowsers()).length, 49, 'Return all obsolete browsers');
});

test('Tests methods', (t) => {
    let parser = new Parser(data);
    t.plan(2);
    t.equal(parser.getTests()[0].name, 'proper tail calls (tail call optimisation)', 'Return all tests');
    t.equal(parser.getTestsCount(), 60, 'Return tests count');
});

test('Test methods', (t) => {
    let parser = new Parser(data);
    t.plan(2);
    t.equal(parser.getTest('const').name, 'const', 'Return test for given name');
    t.equal(parser.getTest(), undefined, 'Return undefined if no test found');
});

test('Subtests methods', (t) => {
    let parser = new Parser(data);
    t.plan(3);
    t.equal(parser.getSubtests('const')[0].name, 'basic support', 'Return subtests for a test with given name');
    t.ok(Array.isArray(parser.getSubtests()), 'Return empty array if no subtests found');
    t.equal(parser.getSubtestsCount('const'), 8, 'Return subtests count for a test with given name');
});

test('Find test', (t) => {
    let parser = new Parser(data);
    let tests = parser.findTests('subclass');
    let expectedTests = [
        'Array is subclassable',
        'RegExp is subclassable',
        'Promise is subclassable',
        'Function is subclassable',
        'miscellaneous subclassables'
    ];
    t.plan(2);
    t.equal(tests.length, 5, 'Find tests using fuzzy search');

    let found = 0;
    tests.forEach((test) => {
        if (expectedTests.indexOf(test) !== -1) found += 1;
    });

    t.equal(found, 5, 'Contain all expected tests');
});
