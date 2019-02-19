let assert = require('assert');
let { expect } = require('chai');
let { parse_array } = require('../../lib/index');

describe('array Test', function() {
    it('Arraylike: []', function() {
        let json = `[]`
        let input = parse_array(json)
        let output = {value:"[]",type:"Array", len: json.length};
        expect(input).to.deep.equal(output)
        // assert.equal(JSON.stringify(parse(json1)), '{"value":"[]","type":"Array"}');
    });
})

