let skip_whitespace = (json, pointer) => {
    while(json[pointer] === ' '|| json[pointer] === '\t' || json[pointer] === '\n' || json[pointer] === '\r') {
        pointer++;
    }
    return pointer;
};

module.exports = skip_whitespace;