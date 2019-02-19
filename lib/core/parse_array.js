const skip_whitespace = require('./skip_whitespace');
const parse_value = require('./parse_value');
const  parse_array = (value) => {
    let p = 0, key = 0, result = [];
    p++;
    p = skip_whitespace(value, p);
    let tree = {
        key: '',
        value: '',
        children: [],
        type: ''
    };
    if(value[p] === ']') {
        return {
            value: '[]',
            type: 'Array',
            len: p+1
        };
    }
    for (let depth = 1;depth !== 0;p++) {
        p = skip_whitespace(value, p);
        if(value[p] === ',')
            p++;
        if(value[p] !== ']') {
            // console.log(value.substr(p))
            let val = parse_value(value.substr(p));
            if(val.type === 'Object') {
                tree.children = val.value;
            } else {
                tree.value = val.value;
                tree.children = val.children;
            }
            tree.type = val.type;
            tree.key = key;
            result.push(JSON.parse(JSON.stringify(tree)));
            p+=val.len;
            // console.log(val.len)
        }
        key++;
        if(value[p] === '[')
            depth++;
        if(value[p] === ']')
            depth--;
    }
    return {
        value: value.substr(0, p),
        children: result,
        type: 'Array',
        len: p
    };
};

module.exports = parse_array;