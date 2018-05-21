let assert = require('assert');
let {parse} = require('../build/index');

describe('parser', function() {
    assert.equal()
    it('Arraylike: []', function() {
        let json1 = `[]`
        assert.equal(JSON.stringify(parse(json1)), '{"value":"[]","type":"Array"}');
    });
    it(`Arraylike: [1, [2]]`, function() {
        let json1 = `[1, [2]]`
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":0,"value":"1","type":"Number"},{"key":1,"value":"[2]","children":[{"key":0,"value":"2","type":"Number"}],"type":"Array"}],"type":"Array"}');
    });
    it(`Objectlike: {}`, function() {
        let json1 = `{}`
        assert.equal(JSON.stringify(parse(json1)), '{"value":[],"type":"Object"}');
    });
    it(`Objectlike: {"arra":[1, [2]]}`, function() {
        let json1 = `{"arra":[1, [2]]}`
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"arra","value":"[1, [2]","children":[],"type":"Array","comment":""}],"type":"Object"}');
    });

    it(`Objectlike: {"num":1}`, function() {
        let json1 = `{"num":1}`
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"num","value":"1","children":[],"type":"Number","comment":""}],"type":"Object"}');
    });

    it(`Objectlike: {"str": "test"}`, function() {
        let json1 = `{"str": "test"}`
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"str","value":"test","children":[],"type":"String","comment":""}],"type":"Object"}');
    });
    it(`Objectlike: {"null":null}`, function() {
        let json1 = `{"null":null}`
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"null","value":"null","children":[],"type":"Null","comment":""}],"type":"Object"}');
    });

    it(`Objectlike: {"null":null //test}`, function() {
        let json1 = `{
            "null":null //test
            }`
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"null","value":"null","children":[],"type":"Null","comment":"test"}],"type":"Object"}');
    });
})

