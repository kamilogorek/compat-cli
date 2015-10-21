const data = {
	es6: require('../data/data-es6')
};
const Parser = require('./parser');

module.exports = (argv) => {
    let parser = new Parser(data[argv.spec]);
    let name = argv._[0];

    console.log(parser.getSummary(name));
}
