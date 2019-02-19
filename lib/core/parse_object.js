const skip_whitespace = require('./skip_whitespace');
const parse_value = require('./parse_value');
let keyMarks = ['ﾌ', '\'', '"'];
let parse_object = (value, options) => {
    if(!options || !options.irregular) {
        keyMarks = ['"'];
    }
    let len = value.length;
    let pointer = 1;
    let tree = {
        key: '',
        value: '',
        comment: '',
        children: [],
        type: 'Object'
    };
    let result = [];
    let inKey = false, inValue = false, inComment = false;
    let nextType = 'key';
    let stack = [];
    let commentFlag = false;
    let defaultKeyMark = null;

    // skip whitespace
    pointer = skip_whitespace(value, pointer);
    if(value[pointer] === '}') {
        result = [];
        return {
            value: result,
            type: 'Object',
            len: pointer + 1
        };
    }
    for(let depth = 1;pointer < len && depth !== 0;pointer++) {
        pointer = skip_whitespace(value, pointer);
        // key start
        if(inKey) {
            if(defaultKeyMark&&value[pointer] === defaultKeyMark) {
                // key end
                inKey = false;
                nextType = 'value';
                // eslint-disable-next-line
                tree.key = stack.join('').replace(/"/g, '\\\"');
                stack = [];
                pointer = skip_whitespace(value, pointer);
                commentFlag = true;
            } else {
                stack.push(value[pointer]);
            }
        }
        if (keyMarks.includes(value[pointer]) && nextType === 'key' && !inKey) {
            defaultKeyMark = value[pointer];
            inKey = true;
            tree = {
                key: '',
                value: '',
                children: [],
                type: 'Object',
                comment: ''
            };
        }
        if(inValue) {
            let val = parse_value(value.substr(pointer));
            pointer += val.len;
            if(val.type === 'Object') {
                tree.children = val.value;
            } else {
                tree.value = val.value;
            }
            if(val.type === 'Array') {
                tree.children = val.children;
            }
            tree.type = val.type;
            result.push(JSON.parse(JSON.stringify(tree)));
            inValue = false;
            nextType = 'key';
        }
        if(value[pointer] === ':' && !inValue && !inComment) {
            pointer = skip_whitespace(value, pointer);
            inValue = true;
        }
        if(value[pointer] === '/' && value[pointer - 1] === '/' && !inValue && !inKey && commentFlag) {
            // sigle line comment start
            let comment = parse_single_comment(value.substr(pointer));

            pointer += comment.len;
            tree.comment = comment.comment;
            result.pop();
            result.push(JSON.parse(JSON.stringify(tree)));
        }
        if(value[pointer] === '*' && value[pointer - 1] === '/' && !inValue && !inKey) {
            // sigle line comment start
            let comment = parse_multi_comment(value.substr(pointer));

            pointer += comment.len;
            tree.comment = comment.comment;
            result.pop();
            result.push(JSON.parse(JSON.stringify(tree)));
        }
        if(value[pointer] === '{') depth++;
        if(value[pointer] === '}') depth--;
    }
    return {
        value: result,
        len: pointer,
        type: 'Object'
    };

};


let parse_single_comment = function (value) {
    let p = 0;
    for (;value[p]&&value[p] !== '\n'; p++);
    return {
        comment: value.substr(1, p-1),
        len: p+1
    };
};

let parse_multi_comment = function (value) {
    let p = 0;
    for (;value[p]&&!(value[p] === '/' && value[p-1] === '*'); p++);
    return {
        comment: value.substr(1, p-2),
        len: p+1
    };
};

module.exports = parse_object;
