'use strict';

const _ = require('lodash');

class Parser {
    constructor (data) {
        if (_.any(_.pick(data, ['name', 'browser', 'tests']), _.isUndefined)) throw new Error('Invalid data format');

        this.spec = data.name;
        this.browsers = data.browsers;
        this.tests = data.tests;
    }

    getSpec () {
        return _.get(this, 'spec');
    }

    getBrowsers () {
        return _.get(this, 'browsers', {});
    }

    getCurrentBrowsers () {
        let browsers = this.getBrowsers();

        return Object.keys(browsers).reduce((current, browser) => {
            let isObsolete = browsers[browser].obsolete === true || browsers[browser].obsolete === 'very';
            let isUnstable = browsers[browser].unstable === true;
            if (!isObsolete && !isUnstable) current[browser] = browsers[browser];
            return current;
        }, {});
    }

    getUnstableBrowsers () {
        let browsers = this.getBrowsers();

        return Object.keys(browsers).reduce((unstable, browser) => {
            let isUnstable = browsers[browser].unstable === true;
            if (isUnstable) unstable[browser] = browsers[browser];
            return unstable;
        }, {});
    }

    getObsoleteBrowsers () {
        let browsers = this.getBrowsers();

        return Object.keys(browsers).reduce((obsolete, browser) => {
            let isObsolete = browsers[browser].obsolete === true || browsers[browser].obsolete === 'very';
            if (isObsolete) obsolete[browser] = browsers[browser];
            return obsolete;
        }, {});
    }

    getTests () {
        return _.get(this, 'tests', []);
    }

    getTestsCount (name) {
        return _.size(this.getTests());
    }

    getTest (name) {
        return _.findWhere(this.getTests(), {
            name: name
        });
    }

    getSubtests (name) {
        return _.get(this.getTest(name), 'subtests', []);
    }

    getSubtestsCount (name) {
        return _.size(this.getSubtests(name));
    }

    getSummary (name) {
        let browsers = this.getBrowsers();
        let subtests = this.getSubtests(name);
        let subtestsCount = this.getSubtestsCount(name);
        let summary = subtests.reduce((results, subtest) => {
            Object.keys(subtest.res).forEach((key) => {
                results[key] = results[key] || 0;
                if (subtest.res[key] === true) results[key] += 1;
            });
            return results;
        }, {});

        return Object.keys(summary).sort().map((browser) => {
            return `${browsers[browser].full} [${browsers[browser].short}]: ${summary[browser]}/${subtestsCount}`;
        });
    }
}

module.exports = Parser;
