'use strict';

const _ = require('lodash');
const Fuse = require('fuse.js');

let _stripHtmlTags = (data) => {
    return data
        .replace(/<[^>]*>/gi, ' ') // replace HTML tags
        .replace(/\s+/g, ' ') // remove whitespace duplicates
        .replace(/\s?\-\s?/g, '-') // remove whitespace near hyphens
        .replace(/&nbsp;?/g, ' ') // substitute html whitespaces
        .trim(); // trim whitespaces
}

class Parser {
    constructor (data) {
        let dataKeys = _.keys(data);
        let requiredKeys = ['name', 'browsers', 'tests'];

        _.forEach(requiredKeys, (key) => {
            if (!_.includes(dataKeys, key)) throw new Error('Invalid data format');
        });

        Object.keys(data.browsers).forEach((key) => {
            data.browsers[key].short = _stripHtmlTags(data.browsers[key].short);
        });

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
        return _.find(this.getTests(), {
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
module.exports._stripHtmlTags = _stripHtmlTags;
