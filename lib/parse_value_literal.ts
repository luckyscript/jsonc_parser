interface jsonSimpleValue {
    value: any,
    type: string
}

/**
 * @param value 
 * @param symbol 
 * this function parse true, false ,null
 */
let parse_value_literal = function (value:string, symbol:string):jsonSimpleValue|any {
    for(let i = 0; i < symbol.length; i++) {
        if(value[i] != symbol[i]) {
            throw new Error('unknow value')
        }
    }
    switch(symbol) {
        case 'true':
            return {
                value: 'true',
                type: 'Boolean',
                len: 4
            }
        case 'false':
            return {
                value: 'false',
                type: 'Boolean',
                len: 5
            }
        case 'null':
            return {
                value: 'null',
                type: 'Null',
                len: 4
            }
        default: return;
    }
}

export default parse_value_literal;