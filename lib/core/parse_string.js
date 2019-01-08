const skip_whitespace = require('./skip_whitespace');
/**
 *
 * @param value
 */
function parse_string (value, mark) {
    let p = 0;
    let ppre = '', pre = '';
    p++;
    p = skip_whitespace(value, p);
    if(value[p] == mark) {
        return {
            value: '',
            type: 'String',
            len: p+1
        }
    }
    for(;!(pre != '\\'&& value[p] == mark) || (ppre == '\\' && pre == '\\' && value[p] == mark); p++) {
        if(!value[p]) {
            throw new Error('string needs correct match mark')
        }
        ppre = pre;
        pre = value[p];
    }
    return {
        value: value.substr(1, p-1).replace(/ﾌ/g, ''),
        type: 'String',
        len: p+1
    }
}

module.exports = parse_string;