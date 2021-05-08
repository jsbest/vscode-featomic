"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class SnippetsCompletionProvider {
    constructor(snippetMapings, hub) {
        this.classList = [];
        if (snippetMapings) {
            this.convertPalettes(snippetMapings);
        }
        if (hub) {
            hub.on('update', (e) => {
                this.convertPalettes(e.snippets);
            });
        }
    }
    convertPalettes(classMapings) {
        if (classMapings) {
            this.classList = [];
            classMapings.forEach(item => {
                item.forEach((cls, key) => {
                    const { prefix, description, content } = cls;
                    this.classList.push({
                        label: `${prefix}`,
                        kind: 14,
                        detail: description,
                        insertText: new vscode.SnippetString(content)
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
exports.default = SnippetsCompletionProvider;
//# sourceMappingURL=snippets.js.map