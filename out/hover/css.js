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
const vscode = require("vscode");
const renderTip_1 = require("./renderTip");
class default_1 {
    constructor(classMapings, hub) {
        this.getTip = (token, prefix) => {
            if (!this.classLists) {
                return null;
            }
            ;
            const mergeMaps = new Map();
            this.classLists.forEach(item => {
                item.forEach(item => {
                    mergeMaps.set(item.value, Object.assign({}, item));
                });
            });
            let classesIterator = mergeMaps.entries();
            for (let cls of classesIterator) {
                const [key, config] = cls;
                if (key === token) {
                    return config;
                }
            }
        };
        this.classLists = classMapings;
        if (hub) {
            hub.on('update', (e) => {
                this.classLists = e.classNames;
            });
        }
    }
    provideHover(doc, pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const range = doc.getWordRangeAtPosition(pos, /('|"|`)?[\w-]+/);
            if (range) {
                const prefixRange = range.start.translate(0, 1);
                const prefix = doc.getText(new vscode.Range(prefixRange, range.start));
                const token = doc.getText(new vscode.Range(prefixRange, range.end));
                const tip = this.getTip(token, prefix);
                if (tip) {
                    return new vscode.Hover(renderTip_1.default(tip));
                }
            }
            return null;
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=css.js.map