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
const fs = require("fs");
const parser = (content) => __awaiter(void 0, void 0, void 0, function* () {
    const snippets = Object.keys(content);
    const snippetsMappings = new Map();
    snippets.forEach((item) => {
        const detail = content[item];
        const obj = Object.assign(Object.assign({}, detail), { content: Array.isArray(detail.body) ? detail.body.join('\n') : detail.body });
        snippetsMappings.set(item, obj);
    });
    return snippetsMappings;
});
const handler = {
    format(arr) {
        const rawData = arr.map(item => {
            return {
                path: item,
                content: JSON.parse(fs.readFileSync(item, 'utf8'))
            };
        });
        return rawData;
    },
    parse(rawData) {
        return __awaiter(this, void 0, void 0, function* () {
            const palettes = yield Promise.all(rawData.map((item) => __awaiter(this, void 0, void 0, function* () {
                const palette = parser(item.content);
                return palette;
            })));
            return palettes;
        });
    }
};
exports.default = handler;
//# sourceMappingURL=snippets.js.map