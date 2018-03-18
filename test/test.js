let assert = require('assert');
let parser = require('../lib/parser')
let json1 = `{}`
let json2 = `{"a":"b"}`
let json3 = `{
                "a":"b" //comment
            }`
let array1 = `[]`

let array2 = `[{"a":1},{"b":"c"}]`
            
let json4 = `{"a":{}}`
let json5 = `{"a":"//"}`
let json6 = `{"a":"\"test\""}`
describe('parser', function() {
    // assert.equal()
    it('should equal {} -> []', function() {
        assert.equal(JSON.stringify(parser.parser(json1)), '[]')
    });
    it('should equal {"a":"b"}', function() {
        assert.equal(JSON.stringify(parser.parser(json2)), '[{"key":"a","children":[],"value":"\\"b\\"","type":"string"}]')
    });
    it('should equal {"a":"b"//comment}', function() {
        assert.equal(JSON.stringify(parser.parser(json3)), '[{"key":"a","children":[],"value":"\\"b\\"","type":"string","description":"comment"}]')
    });
    it('should equal {"a":"b"}', function() {
        assert.equal(JSON.stringify(parser.parser(json4)), '[{"key":"a","children":[],"value":"{}","type":"object"}]')
    });
    it('should equal [] -> []', function () {
        assert.equal(JSON.stringify(parser.parser(array1)), '[]')
    })
    it('shoult equal', () => {
        assert.equal(JSON.stringify(parser.parser(array2)), '[[{"key":"a","children":[],"value":"1","type":"number"}],[{"key":"b","children":[],"value":"\\"c\\"","type":"string"}]]')
    })
    it('shoult equal', () => {
        assert.equal(JSON.stringify(parser.parser(json5)), '[{"key":"a","children":[],"value":"\\"//\\"","type":"string"}]')
    })
    it('shoult equal', () => {
        assert.equal(JSON.stringify(parser.parser(json6)), '[{"key":"a","children":[],"value":"\\"\\"test\\"\\"","type":"string"}]')
    })
})