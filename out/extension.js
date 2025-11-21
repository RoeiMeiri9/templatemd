"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const yaml = __importStar(require("js-yaml"));
function activate(context) {
    const provider = vscode.languages.registerCompletionItemProvider("tmd", // your language ID
    {
        provideCompletionItems(document, position) {
            // Get front-matter YAML
            const text = document.getText();
            const fmMatch = text.match(/^---\r\n([\s\S]*?)\r\n---/);
            if (!fmMatch)
                return [];
            const fmContent = fmMatch[1];
            let fmData;
            try {
                fmData = yaml.load(fmContent);
            }
            catch {
                return [];
            }
            const variables = fmData.variables || {};
            const line = document.lineAt(position).text;
            const beforeCursor = line.slice(0, position.character);
            const alreadyHasOpen = beforeCursor.endsWith("{{");
            // Return CompletionItems
            return Object.keys(variables).map((key) => {
                const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Variable);
                item.insertText = new vscode.SnippetString(alreadyHasOpen ? `${key}` : `{${key}}`);
                return item;
            });
        },
    }, "{" // trigger character
    );
    context.subscriptions.push(provider);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map