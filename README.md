> ECMAScript 5/6/7 [compatibility tables](https://github.com/kangax/compat-table) CLI

![](https://github.com/kamilogorek/compat-cli/blob/master/demo.gif)

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
    --subtests    Include subtests in the report                         [boolean]
    --unstable    Include unstable browsers                              [boolean]
    --obsolete    Include obsolete browsers                              [boolean]
    --spec        ECMSScript specification version
         [choices: "es5", "es6", "es7", "esintl", "non-standard"] [default: "es6"]
    --sort-key    Sorting key   [choices: "browser", "score"] [default: "browser"]
    --sort-order  Sorting order                           [choices: "asc", "desc"]
    -h, --help    Show help                                              [boolean]

  Examples
    // Display `rest` compatibility based on ES6 spec
    $ compat-cli rest

    // Display `class` compatibility based on ES7 spec, including subtests information and sorted by score
    $ compat-cli class -s --sort-key=score
```

### TODO

- [ ] Data update prompt after X days
- [ ] Add pre-release build process
- [ ] Merge results if they’re same, but only in simple view (without subtests)
- [ ] Allow for raw output (piping and JSON)
