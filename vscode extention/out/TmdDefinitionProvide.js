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
exports.TmdDefinitionProvider = void 0;
const vscode = __importStar(require("vscode"));
const tools_1 = require("./tools");
class TmdDefinitionProvider {
    provideDefinition(document, position) {
        const wordRange = document.getWordRangeAtPosition(position, /[\w\-]+/ // adjust if variable names allow more chars
        );
        if (!wordRange)
            return;
        const word = document.getText(wordRange);
        const { fmMatch, text } = (0, tools_1.getVariables)(document, position);
        if (!fmMatch || !text)
            return;
        // Find actual line of the variable in the YAML block
        const frontMatterStart = text.indexOf(fmMatch[0]);
        const frontMatterText = fmMatch[0].split("\n");
        let definitionLine = -1;
        for (let i = 0; i < frontMatterText.length; i++) {
            if (frontMatterText[i].trim().startsWith(`${word}:`)) {
                definitionLine = i;
                break;
            }
        }
        if (definitionLine === -1)
            return;
        // Compute absolute line number
        const realLine = document.positionAt(frontMatterStart).line + definitionLine;
        return new vscode.Location(document.uri, new vscode.Position(realLine, 0));
    }
}
exports.TmdDefinitionProvider = TmdDefinitionProvider;
//# sourceMappingURL=TmdDefinitionProvide.js.map