const parser = require('./core/parse');
function parse (json, options) {
    let jsonText = json.trim();
    return parser(jsonText, options);
}

module.exports = {
    parse
}