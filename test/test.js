let assert = require('assert');
let parser = require('../lib/parser')
let json1 = `{}`
describe('parser', function() {
    // assert.equal()
    it('should equal', function() {
        assert.equal(parser.parser(json1), "{,}")
    })
})