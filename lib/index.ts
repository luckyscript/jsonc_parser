import parser from './parser'
export function parse (json:string) {
    let jsonText = json.trim();
    console.log("【jsontext】=> ", jsonText);
    return parser(jsonText);
}