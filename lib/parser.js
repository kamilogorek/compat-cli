const _ = require('lodash');

class Parser {
    constructor (data) {
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

    getModernBrowsers () {
        let browsers = this.getBrowsers();

        return Object.keys(browsers).reduce((modern, browser) => {
            let isObsolete = browsers[browser].obsolete === true || browsers[browser].obsolete === 'very';
            if (!isObsolete) modern[browser] = browsers[browser];
            return modern;
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
