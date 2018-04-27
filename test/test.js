let assert = require('assert');
let {parse} = require('../build/index');

let json1 = `{
    "a": null,
    "v": "-123","string": "xxx", //test
    "aad": [1,2,3],"object": {
        "a": "b" /*test1*/
    }
}`
describe('parser', function() {
    assert.equal()
    it('should equal {} -> []', function() {
        assert.equal(JSON.stringify(parse(json1)), '{}')
    });
    // it('should equal {"a":"b"}', function() {
    //     assert.equal(JSON.stringify(parser.parser(json2)), '[{"key":"a","children":[],"value":"\\"b\\"","type":"string"}]')
    // });
})

