> ECMAScript 5/6/7 [compatibility tables](https://github.com/kangax/compat-table) CLI

## Install

```
// $ npm install --global compat-cli

// Dev mode only for now
$ git clone https://github.com/kamilogorek/compat-cli.git
$ cd compat-cli
$ npm install
$ npm install -g babel
$ babel-node bin/compat-cli.js <name> [options]
```

## Usage

```
$ compat-cli --help

  Usage
    $ compat-cli <name> [options]

  Options
    --beast-mode    Put additional 45lbs plates per side if doing back squats

  Examples
    $ compat-cli rest
```

### TODO

- [ ] Params for detailed tests
- [ ] Data update prompt after X days
- [ ] Data fetching from compat-table repository using rawgithub
- [ ] Parse data on retrieval to more friendly format?
