let assert = require('assert');
let parser = require('../lib/parser')
let json1 = `{}`
let json2 = `{"a":"b"}`
let json3 = `{
                "a":"b" //comment
            }`
            
let json4 = `{"a":{}}`
describe('parser', function() {
    // assert.equal()
    it('should equal {} -> []', function() {
        assert.equal(JSON.stringify(parser.parser(json1)), '[]')
    });
    it('should equal {"a":"b"}', function() {
        assert.equal(JSON.stringify(parser.parser(json2)), '[{"key":"a","children":"\"b\"","value":"\"b\"","type":"string"}]')
    });
    it('should equal {"a":"b"}', function() {
        assert.equal(JSON.stringify(parser.parser(json3)), '[{"key":"a","children":"\"b\"","value":"\"b\"","type":"string","description":"comment"}]')
    });
    it('should equal {"a":"b"}', function() {
        assert.equal(JSON.stringify(parser.parser(json4)), '[{"key":"a","children":[],"value":"{}","type":"object"}]')
    });
})