let { expect } = require('chai');
let { parse_array } = require('../../lib/index');

describe('array Test', function() {
    it('Arraylike: []', function() {
        let json = '[]';
        let input = parse_array(json);
        let output = {value:'[]',type:'Array', len: json.length};
        expect(input).to.deep.equal(output);
    });
    it('ArrayLike: []', function() {
        let json = '[,1,2]';
        let input = () => parse_array(json);
        expect(input).to.throw();
    });
    it('Arraylike: [1, 2]', function() {
        let json = '[1, 2]';
        let input = parse_array(json);
        let output = {
            value:'[1, 2]',
            type:'Array',
            len: json.length, 
            children: [
                {
                    'key': 0,
                    'type': 'Number',
                    'value': '1'
                },
                {
                    'key': 1,
                    'type': 'Number',
                    'value': '2'
                }
            ]
        };
        expect(input).to.deep.equal(output);
    });
});

