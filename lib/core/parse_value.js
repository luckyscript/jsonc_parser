'use strict';
const parse_string = require('./parse_string');
const parse_literal = require('./parse_literal');
const parse_number = require('./parse_number');
let parse_value = function (value) {
    value = value.trim();
    switch(value[0]) {
        // bool
        case 't':
            return parse_literal(value, 'true');
        case 'f':
            return parse_literal(value, 'false');
        // null
        case 'n':
            return parse_literal(value, 'null');
        // string
        case '"':
            return parse_string(value, '"');
        case "'":
            return parse_string(value, "'");
        // array
        case '[':
            const parse_array = require('./parse_array');
            return parse_array(value);
        // object
        case '{':
            const parse_object = require('./parse_object');
            return parse_object(value);
        default:
            return parse_number(value);
    }
};

module.exports = parse_value;