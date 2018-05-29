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
    /**
     * @param value
     * @param symbol
     * this function parse true, false ,null
     */
    var parse_value_literal = function (value, symbol) {
        for (var i = 0; i < symbol.length; i++) {
            if (value[i] != symbol[i]) {
                throw new Error('unknow value');
            }
        }
        switch (symbol) {
            case 'true':
                return {
                    value: 'true',
                    type: 'Boolean',
                    len: 4
                };
            case 'false':
                return {
                    value: 'false',
                    type: 'Boolean',
                    len: 5
                };
            case 'null':
                return {
                    value: 'null',
                    type: 'Null',
                    len: 4
                };
            default: return;
        }
    };
    exports.default = parse_value_literal;
});
