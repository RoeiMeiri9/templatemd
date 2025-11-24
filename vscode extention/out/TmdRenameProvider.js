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
exports.TmdRenameProvider = void 0;
const vscode = __importStar(require("vscode"));
const tools_1 = require("./tools");
class TmdRenameProvider {
    prepareRename(document, position) {
        // Get the word at the cursor position
        const wordRange = document.getWordRangeAtPosition(position, /[\w\-]+/);
        if (!wordRange)
            return Promise.reject("No variable found at cursor");
        const word = document.getText(wordRange);
        // Check if this word is a valid variable
        const { fmMatch, fmData } = (0, tools_1.getVariables)(document);
        if (!fmMatch) {
            return Promise.reject("This document does not have a front matter. Please add a front matter and variables list.");
        }
        else if (!fmData.variables) {
            return Promise.reject("This document does not have any variables in front matter");
        }
        const variables = fmData.variables;
        // Check if the word is actually a variable
        if (!variables.hasOwnProperty(word)) {
            return Promise.reject("Not a valid variable name");
        }
        return wordRange;
    }
    provideRenameEdits(document, position, newName) {
        const wordRange = document.getWordRangeAtPosition(position, /[\w\-]+/);
        if (!wordRange)
            return;
        const oldName = document.getText(wordRange);
        const text = document.getText();
        const edit = new vscode.WorkspaceEdit();
        // 1. Find and replace in front matter (YAML definition)
        const { fmMatch } = (0, tools_1.getVariables)(document);
        if (fmMatch) {
            const frontMatterStart = text.indexOf(fmMatch[0]);
            const frontMatterText = fmMatch[0];
            const lines = frontMatterText.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Match "oldName:" at the start of the key
                const keyMatch = new RegExp(`^(\\s*)(${escapeRegex(oldName)})(:\\s*)`, "g");
                if (keyMatch.test(line)) {
                    const lineStart = document.positionAt(frontMatterStart +
                        frontMatterText.substring(0, frontMatterText.indexOf(line)).length).line;
                    const keyStartCol = line.indexOf(oldName);
                    const keyStart = new vscode.Position(lineStart, keyStartCol);
                    const keyEnd = new vscode.Position(lineStart, keyStartCol + oldName.length);
                    edit.replace(document.uri, new vscode.Range(keyStart, keyEnd), newName);
                    break;
                }
            }
        }
        // 2. Find and replace all {{ variable }} usages in the document
        const templateRegex = new RegExp(`\\{\\{\\s*(${escapeRegex(oldName)})\\s*\\}\\}`, "g");
        let match;
        while ((match = templateRegex.exec(text)) !== null) {
            const varStart = match.index + match[0].indexOf(match[1]);
            const start = document.positionAt(varStart);
            const end = document.positionAt(varStart + match[1].length);
            edit.replace(document.uri, new vscode.Range(start, end), newName);
        }
        return edit;
    }
}
exports.TmdRenameProvider = TmdRenameProvider;
// Helper function to escape regex special characters
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//# sourceMappingURL=TmdRenameProvider.js.map