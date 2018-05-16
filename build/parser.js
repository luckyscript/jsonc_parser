(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "strip-json-comments", "./parse_value_literal", "./parse_value_string", "./skip_whitespace"], factory);
    }
})(function (require, exports) {
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
            return parse_object(json).value;
        }
        else if (json[0] == '[') {
            // array like json
            return JSON.parse(parse_value_array(json).value);
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
            return { value: result };
        }
        for (var depth = 1; pointer < len && depth !== 0; pointer++) {
            // key start
            var char = value[pointer];
            if (inKey) {
                if (char == '"') {
                    // key end
                    inKey = false;
                    nextType = 'value';
                    tree.key = stack.join("");
                    stack = [];
                    pointer = skip_whitespace_1.default(value, pointer);
                    commentFlag = true;
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
                tree.type = val.type;
                result.push(JSON.parse(JSON.stringify(tree)));
                inValue = false;
                nextType = 'key';
            }
            if (char == ':' && !inValue && !inComment) {
                pointer = skip_whitespace_1.default(value, pointer);
                inValue = true;
            }
            if (char == '/' && value[pointer - 1] == '/' && !inValue && !inKey && commentFlag) {
                // sigle line comment start
                var comment = parse_single_comment(value.substr(pointer));
                pointer += comment.len;
                tree.comment = comment.comment;
                result.pop();
                result.push(JSON.parse(JSON.stringify(tree)));
            }
            if (char == '*' && value[pointer - 1] == '/' && !inValue && !inKey) {
                // sigle line comment start
                var comment = parse_multi_comment(value.substr(pointer));
                pointer += comment.len;
                tree.comment = comment.comment;
                result.pop();
                result.push(JSON.parse(JSON.stringify(tree)));
            }
            if (char == '{')
                depth++;
            if (char == '}')
                depth--;
        }
        return {
            value: result,
            len: pointer + 1,
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
        p = skip_whitespace_1.default(value, p);
        if (value[p] == ']') {
            return {
                value: '[]',
                type: 'Array',
                len: p + 1
            };
        }
        for (var depth = 1; depth !== 0; p++) {
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
});
