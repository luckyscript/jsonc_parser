let { expect } = require('chai');
let { parse_literal } = require('../../lib/index');

describe('null or boolean test', function() {
    it('literal value: not literal value', function() {
        const json = 'rrue';
        let input = () => parse_literal(json, 'true');
        expect(input).to.throw();
    });
    const jsons = ['true', 'false', 'null'];
    const output = jsons.map(v => {
        switch(v) {
        case 'true':
            return {
                value: 'true',
                type: 'Boolean',
                len: 4
            };
        case 'false':
            return {
                value: 'false',
                type: 'Boolean',
                len: 5
            };
        case 'null':
            return {
                value: 'null',
                type: 'Null',
                len: 4
            };
        default: return;
        }
    });
    jsons.forEach((json, i) => {
        it(`literal value: ${json}`, function() {
            const input = parse_literal(json, json);
            
            expect(input).to.deep.equal(output[i]);
        });
    });
});

