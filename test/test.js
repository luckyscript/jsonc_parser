const assert = require('assert');
const { expect } = require('chai');
const { parse } = require('../lib/index');

require('./array/test');
require('./literal/test');
require('./number/test');
describe('parser', function() {
    assert.equal();
    it('unsupport input', function() {
        let json = `
        //test
        {}
        `;
        let input = () => parse(json);
        expect(input).to.throw();
    });
    it('Arraylike: []', function() {
        let json = '[]';
        let input = parse(json);
        let output = {value:'[]',type:'Array'};
        expect(input).to.deep.equal(output);
        // assert.equal(JSON.stringify(parse(json1)), '{"value":"[]","type":"Array"}');
    });
    it('Arraylike: [1, [2]]', function() {
        let json = '[1, [2]]';
        assert.equal(JSON.stringify(parse(json)), '{"value":[{"key":0,"value":"1","type":"Number"},{"key":1,"value":"[2]","children":[{"key":0,"value":"2","type":"Number"}],"type":"Array"}],"type":"Array"}');
    });
    it('Objectlike: {}', function() {
        let json1 = '{}';
        assert.equal(JSON.stringify(parse(json1)), '{"value":[],"type":"Object"}');
    });
    it('Objectlike: {"arra":[1, [2]]}', function() {
        let json1 = '{"arra":[1, [2]]}';
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"arra","value":"[1, [2]]","children":[{"key":0,"value":"1","type":"Number"},{"key":1,"value":"[2]","children":[{"key":0,"value":"2","type":"Number"}],"type":"Array"}],"type":"Array","comment":""}],"type":"Object"}');
    });

    it('Objectlike: {"num":1}', function() {
        let json1 = '{"num":1}';
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"num","value":"1","children":[],"type":"Number","comment":""}],"type":"Object"}');
    });

    it('Objectlike: {"str": "test"}', function() {
        let json1 = '{"str": "test"}';
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"str","value":"test","children":[],"type":"String","comment":""}],"type":"Object"}');
    });

    it('Objectlike: {"str": \'test\'}', function() {
        let json1 = `{"str": 'test'}`;
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"str","value":"test","children":[],"type":"String","comment":""}],"type":"Object"}');
    });

    it('Objectlike: {"null":null}', function() {
        let json1 = '{"null":null}';
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"null","value":"null","children":[],"type":"Null","comment":""}],"type":"Object"}');
    });

    it('Objectlike: {"null":true}', function() {
        let json1 = '{"null":true}';
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"null","value":"true","children":[],"type":"Boolean","comment":""}],"type":"Object"}');
    });

    it('Objectlike: {"null":false}', function() {
        let json1 = '{"null":false}';
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"null","value":"false","children":[],"type":"Boolean","comment":""}],"type":"Object"}');
    });

    it('Objectlike: {"null":null //test}', function() {
        let json1 = `{
            "null":null //test
            }`;
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"null","value":"null","children":[],"type":"Null","comment":"test"}],"type":"Object"}');
    });

    it('Objectlike: {"null":null /*test*/}', function() {
        let json1 = `{
            "null":null /*test*/
            }`;
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"null","value":"null","children":[],"type":"Null","comment":"test"}],"type":"Object"}');
    });
    
    it('Objectlike: {"a":[1,2,{"a":1, "b": "c"}]}', function() {
        let json1 = '{"a":[1,2,{"a":1, "b": "c"}]}';
        let tree = {'value':[{'key':'a','value':'[1,2,{"a":1, "b": "c"}]','children':[{'key':0,'value':'1','type':'Number'},{'key':1,'value':'2','type':'Number'},{'key':2,'value':'2','children':[{'key':'a','value':'1','children':[],'type':'Number','comment':''},{'key':'b','value':'c','children':[],'type':'String','comment':''}],'type':'Object'}],'type':'Array','comment':''}],'type':'Object'};
        expect(parse(json1)).to.deep.equal(tree);
    });
    
    it('Objectlike: {"a":{},"b": ""}', function() {
        let json1 = '{"a":{}, "b" : ""}';
        assert.equal(JSON.stringify(parse(json1)), '{"value":[{"key":"a","value":"","children":[],"type":"Object","comment":""},{"key":"b","value":"","children":[],"type":"String","comment":""}],"type":"Object"}');
    });
});

