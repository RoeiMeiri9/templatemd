"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideCompletionItems = provideCompletionItems;
const vscode_1 = require("vscode");
const tools_1 = require("./tools");
function provideCompletionItems(document, position) {
    return Object.keys((0, tools_1.getVariablesForBraces)(document, position)?.variables ?? {}).map((key) => {
        const item = new vscode_1.CompletionItem(key, vscode_1.CompletionItemKind.Variable);
        item.insertText = new vscode_1.SnippetString(key);
        return item;
    });
}
//# sourceMappingURL=completion.js.map