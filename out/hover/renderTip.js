"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
exports.default = (tip) => {
    let markdown = `##### ${tip.comment}\n\`\`\`css\n.${tip.value}{`;
    tip.hover.forEach(item => {
        markdown += `\n ${item.prop}:${item.value};`;
    });
    markdown += `\n}\n \`\`\``;
    return new vscode_1.MarkdownString(markdown);
};
//# sourceMappingURL=renderTip.js.map