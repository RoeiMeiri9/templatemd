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
exports.TmdQuoteFixProvider = void 0;
const vscode = __importStar(require("vscode"));
class TmdQuoteFixProvider {
    provideCodeActions(document, range, context, token) {
        // Only provide actions if we're on a specific line (cursor position)
        if (range.start.line !== range.end.line) {
            return [];
        }
        const line = document.lineAt(range.start.line);
        const lineText = line.text;
        // Check if this line is a YAML key-value pair with quotes
        const yamlPattern = /^(\s*)(\S+):\s*"(.+)"$/;
        const match = yamlPattern.exec(lineText);
        if (!match) {
            return [];
        }
        const [fullMatch, indent, key, value] = match;
        // Check if we're in front matter
        const text = document.getText();
        const beforeCursor = text.substring(0, document.offsetAt(range.start));
        const afterCursor = text.substring(document.offsetAt(range.start));
        // Simple check: is there a --- before and after?
        const hasFrontMatterBefore = /^---\s*$/m.test(beforeCursor);
        const hasFrontMatterAfter = /^---\s*$/m.test(afterCursor);
        if (!hasFrontMatterBefore || !hasFrontMatterAfter) {
            return [];
        }
        // Create the code action (command-based)
        const fix = new vscode.CodeAction("Remove quotes from variable value", vscode.CodeActionKind.QuickFix);
        const newText = `${indent}${key}: ${value}`;
        fix.command = {
            title: "Remove quotes from variable value",
            command: "tmd.fixQuotes",
            arguments: [document.uri, line.range, newText],
        };
        fix.isPreferred = true;
        // Return as CodeAction
        return [fix.command];
    }
}
exports.TmdQuoteFixProvider = TmdQuoteFixProvider;
TmdQuoteFixProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
];
//# sourceMappingURL=TmdQuoteFixProvider.js.map