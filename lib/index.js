const parse_object = require('./core/parse_object');
const parse_array = require('./core/parse_array');
const parse_string = require('./core/parse_string');
const parse_number = require('./core/parse_number');
const parse_literal = require('./core/parse_literal'); // type null or bool
const parse_value = require('./core/parse_value');
const skip_whitespace = require('./core/skip_whitespace');
function parse (json, options) {
    if(json[0] === '{') {
        return {
            value: parse_object(json, options).value,
            type: 'Object',
        };
    } else if(json[0] ==='[') {
        // array like json
        return {
            value: parse_array(json ,options).children || parse_array(json).value,
            type: 'Array'
        };
    } else {
        // if comment is before json, throw error
        throw new Error(`unsupport input: ${json}`);
    }
}

module.exports = {
    parse,
    parse_array,
    parse_object,
    parse_string,
    parse_literal,
    parse_number,
    parse_value,
    skip_whitespace
};

