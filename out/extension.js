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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const index_1 = require("./hub/index");
const css_1 = require("./completion/css");
const snippets_1 = require("./completion/snippets");
const css_2 = require("./hover/css");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataHub = new index_1.default();
        const { classNames, snippets } = yield dataHub.getConfig();
        /**
         * file ext support
         */
        const selectors = [
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'typescriptreact' },
            { scheme: 'file', language: 'javascriptreact' }
        ];
        /**
         * classNames triggers
         */
        const classTriggers = [
            '"',
            "'",
            "''",
            '`',
            '',
            ' '
        ];
        if (classNames) {
            context.subscriptions.push(vscode.languages.registerHoverProvider(selectors, new css_2.default(classNames, dataHub)), vscode.languages.registerCompletionItemProvider(selectors, new css_1.default(classNames, dataHub), ...classTriggers));
        }
        if (snippets) {
            context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selectors, new snippets_1.default(snippets, dataHub)));
        }
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map