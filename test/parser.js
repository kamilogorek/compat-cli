'use strict';

const _ = require('lodash');
const test = require('tape');
const Parser = require('../lib/parser');
const data = require('./data');

let parser;

test('Strip HTML tags from browsers data', (t) => {
    t.plan(7);
    t.equal(Parser.stripHtmlTags('Hello<br>World!'), 'Hello World!', 'Single tag');
    t.equal(Parser.stripHtmlTags('Hello<br>World!<br>'), 'Hello World!', 'Multiple tags');
    t.equal(Parser.stripHtmlTags('Hello +<br><nobr>World!</nobr>'), 'Hello + World!', 'Multiple tags including closing ones');
    t.equal(Parser.stripHtmlTags('Hello-<br>World!'), 'Hello-World!', 'Tags near hyphens left');
    t.equal(Parser.stripHtmlTags('Hello<br>-World!'), 'Hello-World!', 'Tags near hyphens right');
    t.equal(Parser.stripHtmlTags('Hello&nbsp;World!'), 'Hello World!', 'HTML whitespaces');
    t.equal(
        Parser.stripHtmlTags('  <nobr>This</nobr><br> is&nbsppretty<br>-complex-<br>string to work&nbsp;with! '),
        'This is pretty-complex-string to work with!',
        'Everything combined'
    );
});

test('Create parser', (t) => {
    let parser = new Parser(data);
    t.plan(1);
    t.ok(parser instanceof Parser, 'Created succesfully');
});

test('Feed parser with correct data', (t) => {
    let parser = new Parser(data);
    t.plan(6);
    t.ok(_.isString(parser.spec), 'Attach spec name to an instance');
    t.equal(parser.spec, 'ES6', 'Attach valid spec name to an instance');
    t.ok(_.isObject(parser.browsers), 'Attach browsers to an instance');
    t.equal(Object.keys(parser.browsers).length, 80, 'Attach all browsers to an instance');
    t.ok(_.isObject(parser.tests), 'Attach tests to an instance');
    t.equal(Object.keys(parser.tests).length, 60, 'Attach all tests to an instance');
});

test('Feed parser with incorrect data', (t) => {
    t.plan(1);
    t.throws(() => new Parser({ random: 'data' }), 'Throw an error');
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
    t.equal(parser.getTests().length, 60, 'Return all tests');
    t.equal(parser.getTests()[0].name, 'proper tail calls (tail call optimisation)', 'Return correct tests');
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
    t.equal(parser.getSubtests('const').length, 8, 'Return all subtests for a test with given name');
    t.equal(parser.getSubtests('const')[0].name, 'basic support', 'Return correct subtests for a test with given name');
    t.ok(Array.isArray(parser.getSubtests()), 'Return empty array if no subtests found');
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
