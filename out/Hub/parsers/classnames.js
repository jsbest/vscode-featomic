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
const fs = require("fs");
const parser = (css, path) => __awaiter(void 0, void 0, void 0, function* () {
    const cssAST = yield postcss().process(css, {
        from: path,
    });
    const classMappings = new Map();
    if (cssAST.root && Array.isArray(cssAST.root.nodes)) {
        cssAST.root.nodes.forEach((childNode) => {
            const { type, selector, nodes } = childNode;
            const prevNode = childNode.prev();
            if (type === 'rule') {
                const className = selector.replace('.', '');
                classMappings.set(className, {
                    value: className,
                    comment: prevNode && prevNode.type === 'comment'
                        ? prevNode.text : '',
                    hover: nodes
                });
            }
        });
    }
    return classMappings;
});
const handler = {
    format(arr) {
        const rawData = arr.map(item => {
            return {
                path: item,
                content: fs.readFileSync(item, 'utf8')
            };
        });
        return rawData;
    },
    parse(rawData) {
        return __awaiter(this, void 0, void 0, function* () {
            const palettes = yield Promise.all(rawData.map((item) => __awaiter(this, void 0, void 0, function* () {
                const palette = yield parser(item.content, item.path);
                return palette;
            })));
            return palettes;
        });
    }
};
exports.default = handler;
//# sourceMappingURL=classnames.js.map