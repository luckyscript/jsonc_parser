"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sjc = require("strip-json-comments");
var parse_value_literal_1 = require("./parse_value_literal");
var parse_value_string_1 = require("./parse_value_string");
function parse(json) {
    if (!check_valid(json))
        throw new Error("Not valid JSON");
    if (json[0] === '{') {
        return parse_object(json);
    }
}
var parse_object = function (json) {
    var len = json.length;
    var pointer = 1;
    var tree = {
        key: '',
        value: '',
        children: [],
        type: 'Object'
    };
    var result = [];
    var inKey = false, inValue = false, inComment = false;
    var nextType = 'key';
    var stack = [];
    // skip whitespace
    pointer = skip_whitespace(json, pointer);
    if (json[pointer] == '}') {
        result = [];
        return result;
    }
    for (; pointer < len; pointer++) {
        // key start
        var char = json[pointer];
        if (inKey) {
            if (char == '"') {
                // key end
                inKey = false;
                nextType = 'value';
                tree.key = stack.join("");
                stack = [];
                pointer = skip_whitespace(json, pointer);
            }
            else {
                stack.push(char);
            }
        }
        if (char == '"' && nextType == 'key') {
            // stack.push(char)
            inKey = true;
            // result.push(JSON.parse(JSON.stringify(tree))
            tree = {
                key: '',
                value: '',
                children: [],
                type: 'Object'
            };
        }
        if (inValue) {
            var val = parse_value(json.substr(pointer));
            console.log(val);
            pointer += val.len;
            tree.value = val.value;
            tree.type = val.type;
            result.push(JSON.parse(JSON.stringify(tree)));
            inValue = false;
            nextType = 'key';
        }
        if (char == ':' && !inValue && !inComment) {
            pointer = skip_whitespace(json, pointer);
            inValue = true;
        }
        // if(char == ','  && !inValue && !inComment) {
        // }
    }
    return result;
};
var skip_whitespace = function (json, pointer) {
    while (json[pointer] == ' ' || json[pointer] == '\t' || json[pointer] == '\n' || json[pointer] == '\r') {
        pointer++;
    }
    return pointer;
};
var parse_comment = function () {
};
var parse_value = function (value) {
    value = value.trim();
    switch (value[0]) {
        // bool
        case 't':
            return parse_value_literal_1.default(value, 'true');
        case 'f':
            return parse_value_literal_1.default(value, 'false');
        // null
        case 'n':
            return parse_value_literal_1.default(value, 'null');
        // string
        case '"':
            return parse_value_string_1.default(value);
        // array
        case '[':
            return parse_value_array(value);
        // object
        case '{':
            return parse_object(value);
        default:
            return parse_number(value);
    }
};
var parse_value_array = function (value) {
    var p = 0;
    p++;
    p = skip_whitespace(value, p);
    if (value[p] == ']') {
        return {
            value: '[]',
            type: 'Array',
            len: p + 1
        };
    }
    console.log("this");
    for (var depth = 1; depth !== 0; p++) {
        console.log("dep", depth);
        if (value[p] == '[')
            depth++;
        if (value[p] == ']')
            depth--;
    }
    return {
        value: value.substr(0, p),
        type: 'Array',
        len: p + 1
    };
};
var parse_number = function (value) {
    var p = 0;
    if (value[p] == '-')
        p++;
    if (value[p] == '0')
        p++;
    else {
        if (!ISDIGIT1TO9(value[p]))
            throw new Error('not a valid number');
        for (p++; ISDIGIT(value[p]); p++)
            ;
    }
    if (value[p] == '.') {
        p++;
        if (!ISDIGIT(value[p]))
            throw new Error('not a valid number');
        for (p++; ISDIGIT(value[p]); p++)
            ;
    }
    if (value[p] == 'e' || value[p] == 'E') {
        p++;
        if (value[p] == '+' || value[p] == '-')
            p++;
        if (!ISDIGIT(value[p]))
            throw new Error('not a valid number');
        for (p++; ISDIGIT(value[p]); p++)
            ;
    }
    return {
        value: value.substr(0, p),
        type: 'Number',
        len: p + 1
    };
};
var check_valid = function (json) {
    try {
        JSON.parse(sjc(json));
    }
    catch (e) {
        return false;
    }
    return true;
};
var ISDIGIT = function (v) {
    return v <= '9' && v >= '0';
};
var ISDIGIT1TO9 = function (v) {
    return v <= '9' && v >= '1';
};
exports.default = parse;
//# sourceMappingURL=parser.js.map