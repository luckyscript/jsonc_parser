"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
function parse(json) {
    var jsonText = json.trim();
    return parser_1.default(jsonText);
}
exports.parse = parse;
