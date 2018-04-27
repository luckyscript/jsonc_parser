import * as sjc from "strip-json-comments";
import parse_value_literal from './parse_value_literal';
import parse_value_string from './parse_value_string';

interface Tree {
    key: string,
    value: string,
    children: Array<any>,
    type: string
}

function parse (json:string):any {
    if(!check_valid(json))
        throw new Error("Not valid JSON");
    if(json[0] === '{') {
        return parse_object(json)
    }
}

let parse_object = (json:string):Array<Tree>|any => {
    let len:number = json.length;
    let pointer:number = 1;
    let tree:Tree = {
        key: '',
        value: '',
        children: [],
        type: 'Object'
    }
    let result: Array<Tree>|any = [];
    let inKey:boolean = false, inValue: boolean = false, inComment:boolean = false;
    let nextType = 'key';
    let stack:Array<string> = [];
    
    // skip whitespace
    pointer = skip_whitespace(json, pointer);
   
    if(json[pointer] == '}') {
        result = [];
        return result;
    }
    for(;pointer < len;pointer++) {
        // key start
        let char:string = json[pointer];
        if(inKey) {
            if(char == '"') {
                // key end
                inKey = false;
                nextType = 'value';
                tree.key = stack.join("");
                stack = [];
                pointer = skip_whitespace(json, pointer);
            } else {
                stack.push(char);
            }
        }
        if(char == '"' && nextType == 'key') {
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
        if(inValue) {
            let val = parse_value(json.substr(pointer));
            console.log(val)
            pointer += val.len;
            tree.value = val.value;
            tree.type = val.type;
            result.push(JSON.parse(JSON.stringify(tree)));
            inValue = false;
            nextType = 'key';
        }
        if(char == ':' && !inValue && !inComment) {
            pointer = skip_whitespace(json, pointer);
            inValue = true;
        }
        // if(char == ','  && !inValue && !inComment) {

        // }
    }
    return result;

}


let skip_whitespace = (json:string, pointer:number):number => {
    while(json[pointer] == ' '|| json[pointer] == '\t' || json[pointer] == '\n' || json[pointer] == '\r') {
        pointer++;
    }
    return pointer;
}

let parse_comment = function () {
}

let parse_value = function (value: string) {
    value = value.trim();
    switch(value[0]) {
        // bool
        case 't': 
            return parse_value_literal(value, 'true')
        case 'f': 
            return parse_value_literal(value, 'false');
        // null
        case 'n': 
            return parse_value_literal(value, 'null');
        // string
        case '"':
            return parse_value_string(value);
        // array
        case '[':
            return parse_value_array(value);
        // object
        case '{':
            return parse_object(value);
        default:
            return parse_number(value);
    }
}

let parse_value_array = (value:string) => {
    let p = 0;
    p++;
    p = skip_whitespace(value, p);
    if(value[p] == ']') {
        return {
            value: '[]',
            type: 'Array',
            len: p+1
        }
    }
    console.log("this")
    for (let depth = 1;depth !== 0;p++) {
        console.log("dep",depth)
        if(value[p] == '[')
            depth++;
        if(value[p] == ']')
            depth--;
    }
    return {
        value: value.substr(0, p),
        type: 'Array',
        len: p+1
    }

}
let parse_number = (value:string) => {
    let p = 0;
    if(value[p] == '-')
        p++;
    if(value[p] == '0')
        p++;
    else {
        if(!ISDIGIT1TO9(value[p]))
            throw new Error('not a valid number');
        for(p++; ISDIGIT(value[p]); p++);
    }
    if (value[p] == '.') {
        p++;
        if (!ISDIGIT(value[p])) 
            throw new Error('not a valid number');
        for (p++; ISDIGIT(value[p]); p++);
    }
    if (value[p] == 'e' || value[p] == 'E') {
        p++;
        if (value[p] == '+' || value[p] == '-') p++;
        if (!ISDIGIT(value[p])) 
            throw new Error('not a valid number');
        for (p++; ISDIGIT(value[p]); p++);
    }
    return {
        value: value.substr(0, p),
        type: 'Number',
        len: p+1
    }
}

let check_valid = function(json:string):boolean {
    try {
        JSON.parse(sjc(json));
    } catch(e) {
        return false;
    }
    return true;
}

let ISDIGIT = (v:string) => {
    return v <= '9' && v >= '0';
}
let ISDIGIT1TO9 = (v:string) => {
    return v <= '9' && v >= '1';
}
export default parse;

