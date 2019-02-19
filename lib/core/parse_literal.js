/**
 * @param value
 * @param symbol
 * this function parse true, false ,null
 */
const parse_literal = function (value, symbol) {
    for(let i = 0; i < symbol.length; i++) {
        if(value[i] !== symbol[i]) {
            throw new Error('unknow value');
        }
    }
    switch(symbol) {
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
    }
};
module.exports = parse_literal;