"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skip_whitespace_1 = require("./skip_whitespace");
/**
 *
 * @param value
 */
function default_1(value) {
    var p = 0;
    var ppre = '', pre = '';
    p++;
    p = skip_whitespace_1.default(value, p);
    if (value[p] == '"') {
        return {
            value: '',
            type: 'String',
            len: p + 1
        };
    }
    for (; !(pre != '\\' && value[p] == '"') || (ppre == '\\' && pre == '\\' && value[p] == '"'); p++) {
        ppre = pre;
        pre = value[p];
    }
    return {
        value: value.substr(1, p - 1),
        type: 'String',
        len: p + 1
    };
}
exports.default = default_1;
