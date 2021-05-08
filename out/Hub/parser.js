"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const parser = (css, path) => __awaiter(void 0, void 0, void 0, function* () {
    const cssAST = yield postcss().process(css, {
        from: path,
    });
    const classMappings = new Map();
    if (cssAST.root && Array.isArray(cssAST.root.nodes)) {
        cssAST.root.nodes.forEach((childNode) => {
            // console.log('---childNode-', childNode);
            //   const { type, name, value, variable } = childNode;
            //   const prevNode = childNode.prev();
            //   if (variable && type === 'atrule') {
            //     themeMappings.set(name, {
            //       value,
            //       comment: prevNode && prevNode.type === 'comment'
            //         ? prevNode.text
            //         : ''
            //     });
            //   }
            console.log(childNode);
        });
    }
    return classMappings;
});
exports.default = parser;
//# sourceMappingURL=parser.js.map