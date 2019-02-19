let parse_number = (value) => {
    let p = 0;
    if(value[p] === '-')
        p++;
    if(value[p] === '0')
        p++;
    else {
        if(!ISDIGIT1TO9(value[p]))
            throw new Error('unsupport value type');
        for(p++; ISDIGIT(value[p]); p++);
    }
    if (value[p] === '.') {
        p++;
        if (!ISDIGIT(value[p]))
            throw new Error('unsupport value type');
        for (p++; ISDIGIT(value[p]); p++);
    }
    if (value[p] === 'e' || value[p] === 'E') {
        p++;
        if (value[p] === '+' || value[p] === '-') p++;
        if (!ISDIGIT(value[p]))
            throw new Error('unsupport value type');
        for (p++; ISDIGIT(value[p]); p++);
    }
    return {
        value: value.substr(0, p),
        type: 'Number',
        len: p
    };
};



let ISDIGIT = (v) => {
    return v <= '9' && v >= '0';
};
let ISDIGIT1TO9 = (v) => {
    return v <= '9' && v >= '1';
};
module.exports = parse_number;