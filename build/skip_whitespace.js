"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skip_whitespace = function (json, pointer) {
    while (json[pointer] == ' ' || json[pointer] == '\t' || json[pointer] == '\n' || json[pointer] == '\r') {
        pointer++;
    }
    return pointer;
};
exports.default = skip_whitespace;
//# sourceMappingURL=skip_whitespace.js.map