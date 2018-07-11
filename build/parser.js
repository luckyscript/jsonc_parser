"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sjc = require("strip-json-comments");
var parse_value_literal_1 = require("./parse_value_literal");
var parse_value_string_1 = require("./parse_value_string");
var skip_whitespace_1 = require("./skip_whitespace");
function parse(json) {
    if (!check_valid(json))
        throw new Error("Not valid JSON");
    if (json[0] === '{') {
        return {
            value: parse_object(json).value,
            type: 'Object',
        };
    }
    else if (json[0] == '[') {
        // array like json
        return {
            value: parse_value_array(json).children || parse_value_array(json).value,
            type: 'Array'
        };
    }
    else {
        // if comment is before json, throw error
        throw new Error("unsupport input: " + json);
    }
}
var parse_object = function (value) {
    var len = value.length;
    var pointer = 1;
    var tree = {
        key: '',
        value: '',
        comment: '',
        children: [],
        type: 'Object'
    };
    var result = [];
    var inKey = false, inValue = false, inComment = false;
    var nextType = 'key';
    var stack = [];
    var commentFlag = false;
    // skip whitespace
    pointer = skip_whitespace_1.default(value, pointer);
    if (value[pointer] == '}') {
        result = [];
        return {
            value: result,
            type: 'Object',
            len: pointer + 1
        };
    }
    for (var depth = 1; pointer < len && depth !== 0; pointer++) {
        pointer = skip_whitespace_1.default(value, pointer);
        // key start
        if (inKey) {
            if (value[pointer] == '"') {
                // key end
                inKey = false;
                nextType = 'value';
                tree.key = stack.join("");
                stack = [];
                pointer = skip_whitespace_1.default(value, pointer);
                commentFlag = true;
            }
            else {
                stack.push(value[pointer]);
            }
        }
        if (value[pointer] == '"' && nextType == 'key') {
            // stack.push(value[pointer])
            inKey = true;
            // result.push(JSON.parse(JSON.stringify(tree))
            tree = {
                key: '',
                value: '',
                children: [],
                type: 'Object',
                comment: ''
            };
        }
        if (inValue) {
            var val = parse_value(value.substr(pointer));
            pointer += val.len;
            if (val.type == 'Object') {
                tree.children = val.value;
            }
            else {
                tree.value = val.value;
            }
            if (val.type == 'Array') {
                tree.children = val.children;
            }
            tree.type = val.type;
            result.push(JSON.parse(JSON.stringify(tree)));
            inValue = false;
            nextType = 'key';
        }
        if (value[pointer] == ':' && !inValue && !inComment) {
            pointer = skip_whitespace_1.default(value, pointer);
            inValue = true;
        }
        if (value[pointer] == '/' && value[pointer - 1] == '/' && !inValue && !inKey && commentFlag) {
            // sigle line comment start
            var comment = parse_single_comment(value.substr(pointer));
            pointer += comment.len;
            tree.comment = comment.comment;
            result.pop();
            result.push(JSON.parse(JSON.stringify(tree)));
        }
        if (value[pointer] == '*' && value[pointer - 1] == '/' && !inValue && !inKey) {
            // sigle line comment start
            var comment = parse_multi_comment(value.substr(pointer));
            pointer += comment.len;
            tree.comment = comment.comment;
            result.pop();
            result.push(JSON.parse(JSON.stringify(tree)));
        }
        if (value[pointer] == '{')
            depth++;
        if (value[pointer] == '}')
            depth--;
        // console.log(pointer, value[pointer], depth,value[pointer],(value[pointer] == '}'))
    }
    return {
        value: result,
        len: pointer,
        type: 'Object'
    };
};
var parse_single_comment = function (value) {
    var p = 0;
    for (; value[p] != '\n'; p++)
        ;
    return {
        comment: value.substr(1, p - 1),
        len: p + 1
    };
};
var parse_multi_comment = function (value) {
    var p = 0;
    for (; !(value[p] == '/' && value[p - 1] == '*'); p++)
        ;
    return {
        comment: value.substr(1, p - 2),
        len: p + 1
    };
};
var parse_value = function (value) {
    value = value.trim();
    // console.log(value)
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
    var p = 0, key = 0, result = [];
    p++;
    p = skip_whitespace_1.default(value, p);
    var tree = {
        key: '',
        value: '',
        children: [],
        type: ''
    };
    if (value[p] == ']') {
        return {
            value: '[]',
            type: 'Array',
            len: p + 1
        };
    }
    for (var depth = 1; depth !== 0; p++) {
        p = skip_whitespace_1.default(value, p);
        if (value[p] == ',')
            p++;
        if (value[p] != ']') {
            // console.log(value.substr(p))
            var val = parse_value(value.substr(p));
            if (val.type == 'Object') {
                tree.children = val.value;
            }
            else {
                tree.value = val.value;
                tree.children = val.children;
            }
            tree.type = val.type;
            tree.key = key;
            result.push(JSON.parse(JSON.stringify(tree)));
            p += val.len;
            // console.log(val.len)
        }
        key++;
        if (value[p] == '[')
            depth++;
        if (value[p] == ']')
            depth--;
    }
    return {
        value: value.substr(0, p),
        children: result,
        type: 'Array',
        len: p
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
            throw new Error(value + ": not a valid number");
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
        len: p
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
