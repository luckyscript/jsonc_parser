import skip_whitespace from './skip_whitespace'
/**
 * 
 * @param value 
 */
export default function(value:string) {
    let p = 0;
    let ppre = '', pre = '';
    p++;
    p = skip_whitespace(value, p);
    if(value[p] == '"') {
        return {
            value: '',
            type: 'String',
            len: p+1
        }
    }
    for(;!(pre != '\\'&& value[p] == '"') || (ppre == '\\' && pre == '\\' && value[p] == '"'); p++) {
        ppre = pre;
        pre = value[p];
    }
    return {
        value: value.substr(1, p-1),
        type: 'String',
        len: p+1
    }
}