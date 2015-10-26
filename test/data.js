require('object.assign').shim();

var temp = {};
var flag = "flagged";
var very = "very";
var strict = "strict";
var fallthrough = "needs-polyfill-or-native";

exports.name = 'ES6';
exports.target_file = 'es6/index.html';
exports.skeleton_file = 'es6/skeleton.html';

exports.browsers = {
  tr: {
    full: 'Traceur',
    short: 'Traceur',
    obsolete: false,
    platformtype: 'compiler',
  },
  babel: {
    full: 'Babel',
    short: 'Babel +<br><nobr>core-js</nobr>',
    obsolete: false,
    platformtype: 'compiler',
    note_id: 'babel-optional',
    note_html: 'Flagged features require an optional transformer setting.',
  },
  firefox40: {
    full: 'Firefox',
    short: 'FF 40',
    obsolete: true,
  },
  firefox41: {
    full: 'Firefox',
    short: 'FF 41',
  },
  firefox42: {
    full: 'Firefox',
    short: 'FF 42',
    unstable: true,
  },
  chrome45: {
    full: 'Chrome, Opera',
    short: 'CH 45,<br>OP&nbsp;32',
    obsolete: true,
    note_id: 'experimental-flag',
  },
  chrome46: {
    full: 'Chrome, Opera',
    short: 'CH 46,<br>OP&nbsp;33',
    note_id: 'experimental-flag',
  },
  chrome47: {
    full: 'Chrome, Opera',
    short: 'CH 47,<br>OP&nbsp;34',
    unstable: true,
    note_id: 'experimental-flag',
  }
};

exports.tests = [
{
  name: 'arrow functions',
  category: 'functions',
  significance: 'large',
  link: 'http://www.ecma-international.org/ecma-262/6.0/#sec-arrow-function-definitions',
  subtests: [
    {
      name: '0 parameters',
      exec: function(){/*
        return (() => 5)() === 5;
      */},
      res: {
        tr:          true,
        babel:       true,
        es6tr:       true,
        jsx:         true,
        typescript:  true,
        ejs:         true,
        closure:     true,
        edge12:      true,
        firefox23:   true,
        chrome38:    flag,
        chrome40:    false,
        chrome45:    true,
        webkit:      true,
        node012:     flag,
        node4:       true,
      },
    },
    {
      name: '1 parameter, no brackets',
      exec: function(){/*
        var b = x => x + "foo";
        return (b("fee fie foe ") === "fee fie foe foo");
      */},
      res: {
        tr:          true,
        babel:       true,
        es6tr:       true,
        jsx:         true,
        typescript:  true,
        ejs:         true,
        closure:     true,
        edge12:      true,
        firefox23:   true,
        chrome38:    flag,
        chrome40:    false,
        chrome45:    true,
        webkit:      true,
        node012:     flag,
        node4:       true,
      },
    },
    {
      name: 'multiple parameters',
      exec: function(){/*
        var c = (v, w, x, y, z) => "" + v + w + x + y + z;
        return (c(6, 5, 4, 3, 2) === "65432");
      */},
      res: {
        tr:          true,
        babel:       true,
        es6tr:       true,
        jsx:         true,
        typescript:  true,
        ejs:         true,
        closure:     true,
        edge12:      true,
        firefox23:   true,
        chrome38:    flag,
        chrome40:    false,
        chrome45:    true,
        webkit:      true,
        node012:     flag,
        node4:       true,
      },
    }
  ],
},
{
  name: 'const',
  category: 'bindings',
  significance: 'medium',
  link: 'http://www.ecma-international.org/ecma-262/6.0/#sec-let-and-const-declarations',
  subtests: [
    {
      name: 'basic support',
      exec: function() {/*
        const foo = 123;
        return (foo === 123);
      */},
      res: {
        tr:          true,
        babel:       true,
        typescript:  true,
        es6tr:       true,
        ejs:         true,
        closure:     true,
        ie11:        true,
        firefox11:   true,
        chrome:      true,
        safari51:    true,
        webkit:      true,
        opera:       true,
        konq49:      true,
        node012:     true,
        android40:   true,
      }
    },
    {
      name: 'is block-scoped',
      exec: function() {/*
        const bar = 123;
        { const bar = 456; }
        return bar === 123;
      */},
      res: {
        babel:       true,
        typescript:  true,
        es6tr:       true,
        tr:          true,
        ejs:         true,
        closure:     true,
        ie11:        true,
        firefox36:   true,
        webkit:      true,
      }
    },
    {
      name: 'redefining a const is an error',
      exec: function() {/*
        const baz = 1;
        try {
          Function("const foo = 1; foo = 2;")();
        } catch(e) {
          return true;
        }
      */},
      res: {
        tr:          true,
        babel:       true,
        typescript:  true,
        es6tr:       true,
        ejs:         true,
        closure:     true,
        ie11:        true,
        firefox36:   true,
        webkit:      true,
      }
    },
    {
      name: 'temporal dead zone',
      exec: function(){/*
        var passed = (function(){ try { qux; } catch(e) { return true; }}());
        function fn() { passed &= qux === 456; }
        const qux = 456;
        fn();
        return passed;
      */},
      res: {
        babel:       flag,
        typescript:  true,
        ie11:        true,
        firefox36:   true,
        webkit:      true,
      },
    },
    {
      name: 'basic support (strict mode)',
      exec: function() {/*
        "use strict";
        const foo = 123;
        return (foo === 123);
      */},
      res: {
        tr:          true,
        babel:       true,
        typescript:  true,
        es6tr:       true,
        ejs:         true,
        closure:     true,
        ie11:        true,
        firefox11:   true,
        chrome:      flag,
        chrome41:    true,
        webkit:      true,
        konq49:      true,
        node012:     flag,
        node4:       true,
      }
    },
    {
      name: 'is block-scoped (strict mode)',
      exec: function() {/*
        'use strict';
        const bar = 123;
        { const bar = 456; }
        return bar === 123;
      */},
      res: {
        babel:       true,
        typescript:  true,
        es6tr:       true,
        tr:          true,
        ejs:         true,
        closure:     true,
        chrome19dev: flag,
        chrome41:    true,
        ie11:        true,
        firefox36:   true,
        webkit:      true,
        node012:     flag,
        node4:       true,
      }
    },
    {
      name: 'redefining a const (strict mode)',
      exec: function() {/*
        'use strict';
        const baz = 1;
        try {
          Function("'use strict'; const foo = 1; foo = 2;")();
        } catch(e) {
          return true;
        }
      */},
      res: {
        tr:          true,
        babel:       true,
        typescript:  true,
        es6tr:       true,
        ejs:         true,
        closure:     true,
        ie11:        true,
        firefox11:   true,
        chrome21dev: flag,
        chrome41:    true,
        webkit:      true,
        node012:     flag,
        node4:       true,
      }
    },
    {
      name: 'temporal dead zone (strict mode)',
      exec: function(){/*
        'use strict';
        var passed = (function(){ try { qux; } catch(e) { return true; }}());
        function fn() { passed &= qux === 456; }
        const qux = 456;
        fn();
        return passed;
      */},
      res: {
        babel:       flag,
        typescript:  true,
        ie11:        true,
        firefox36:   true, chrome19dev: flag,
        chrome41:    true,
        webkit:      true,
        node012:     flag,
        node4:       true,
      },
    },
  ]
}
];

exports.tests = exports.tests.reduce(function(a,e) {
  var index = ['optimisation','syntax','bindings','functions',
    'built-ins','built-in extensions','subclassing','misc','annex b'].indexOf(e.category);
  if (index === -1) {
    console.log('"' + a.category + '" is not an ES6 category!');
  }
  (a[index] = a[index] || []).push(e);
  return a;
},[]).reduce(function(a,e) {
  return a.concat(e);
},[]);
