(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var skip_whitespace = function (json, pointer) {
        while (json[pointer] == ' ' || json[pointer] == '\t' || json[pointer] == '\n' || json[pointer] == '\r') {
            pointer++;
        }
        return pointer;
    };
    exports.default = skip_whitespace;
});
