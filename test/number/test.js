let { expect } = require('chai');
let { parse_number } = require('../../lib/index');

describe('null or boolean test', function() {
    const numbers = ['-1', '1', '0', '1e10', '1.1', '1e-10', '1e+10'];
    const output = numbers.map(v => Number(v));
    numbers.forEach((v, i) => {
        it(`number value: ${v}`, function() {
            const input = parse_number(v).value;
            expect(Number(input)).to.equal(output[i]);
        });
    });

    const wrongNumbers = ['+1', '1.a', '1ea'];
    wrongNumbers.forEach(v => {
        it(`wrong number value: ${v}`, function() {
            const input = () => parse_number(v).value;
            expect(input).to.throw();
        });
    });
});

