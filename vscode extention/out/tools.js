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
exports.getVariables = getVariables;
const vscode_1 = require("vscode");
const yaml = __importStar(require("js-yaml"));
function getVariables(document, position) {
    let before = document.getText(new vscode_1.Range(new vscode_1.Position(0, 0), position));
    before = before.replace(/{{{+/g, "{");
    const inside = isInsideDoubleBraces(before);
    if (!inside)
        return {};
    const insideText = getTextInsideBraces(before);
    if (!insideText || insideText.trim().length === 0) {
        return {};
    }
    const text = document.getText();
    const fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!fmMatch)
        return {};
    let fmData;
    try {
        fmData = yaml.load(fmMatch[1]);
    }
    catch {
        return {};
    }
    return { variables: fmData.variables, fmMatch, text };
}
function isInsideDoubleBraces(textBeforeCursor) {
    const lastOpen = textBeforeCursor.lastIndexOf("{{");
    const lastClose = textBeforeCursor.lastIndexOf("}}");
    return lastOpen !== -1 && lastOpen > lastClose;
}
function getTextInsideBraces(before) {
    const lastOpen = before.lastIndexOf("{{");
    const lastClose = before.lastIndexOf("}}");
    if (lastOpen === -1 || lastOpen < lastClose)
        return null;
    return before.slice(lastOpen + 2); // מה שאחרי {{
}
//# sourceMappingURL=tools.js.map