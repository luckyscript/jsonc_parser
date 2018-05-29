import parser from './parser'
export function parse (json:string) {
    let jsonText = json.trim();
    return parser(jsonText);
}