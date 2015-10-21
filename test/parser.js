const test = require('tape');

test('dummy test', function (t) {
    t.plan(1);
    t.equal(typeof Date.now, 'function');
});
