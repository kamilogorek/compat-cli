'use strict';

const _ = require('lodash');
const Fuse = require('fuse.js');

class Parser {
    constructor (data) {
        if (_.any(_.pick(data, ['name', 'browser', 'tests']), _.isUndefined)) throw new Error('Invalid data format');

        this.spec = data.name;
        this.browsers = data.browsers;
        this.tests = data.tests;
    }

    getSpec () {
        return _.get(this, 'spec', 'No spec specified');
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

    getTest (name) {
        console.log(name);
        return _.findWhere(this.getTests(), {
            name: name
        });
    }

    getSubtests (name) {
        return _.get(this.getTest(name), 'subtests', []);
    }

    findTests (name) {
        let fuse = new Fuse(this.getTests(), {
            keys: ['name'],
            id: 'name',
            threshold: 0.35
        });

        return fuse.search(name);
    }
}

module.exports = Parser;
