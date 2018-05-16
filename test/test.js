let assert = require('assert');
let {parse} = require('../build/index');

describe('parser', function() {
    assert.equal()
    it('should equal {} -> []', function() {
        let json1 = `{}`
        assert.equal(JSON.stringify(parse(json1)), '{}');
    });
    it('should equal {} -> []', function() {
        let json1 = `//test
        {}`
        assert.equal(JSON.stringify(parse(json1)), '{}');
    });
    it('should equal {} -> []', function() {
        let json1 = `
        {
            "a": [1,2,3] //ttt
        }`
        assert.equal(JSON.stringify(parse(json1)), '{}');
    });
})

