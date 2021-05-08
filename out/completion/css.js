"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class CSSCompletionProvider {
    constructor(classMapings, hub) {
        this.classList = [];
        if (classMapings) {
            this.convertPalettes(classMapings);
        }
        if (hub) {
            hub.on('update', (e) => {
                this.convertPalettes(e.classNames);
            });
        }
    }
    convertPalettes(classMapings) {
        if (classMapings) {
            this.classList = [];
            classMapings.forEach(item => {
                item.forEach((cls, key) => {
                    const { value, comment } = cls;
                    this.classList.push({
                        label: `${value}`,
                        kind: 1,
                        detail: comment,
                        insertText: new vscode.SnippetString(key)
                    });
                });
            });
        }
    }
    provideCompletionItems(doc, pos, token, context) {
        return this.classList;
    }
    resolveCompletionItem(item, token) {
        return item;
    }
}
exports.default = CSSCompletionProvider;
//# sourceMappingURL=css.js.map