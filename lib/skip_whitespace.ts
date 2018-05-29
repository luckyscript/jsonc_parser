let skip_whitespace = (json:string, pointer:number):number => {
    while(json[pointer] == ' '|| json[pointer] == '\t' || json[pointer] == '\n' || json[pointer] == '\r') {
        pointer++;
    }
    return pointer;
}

export default skip_whitespace;