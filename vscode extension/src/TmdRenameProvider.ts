import * as vscode from "vscode";
import { getVariables, getVariablesForBraces } from "./tools";

export class TmdRenameProvider implements vscode.RenameProvider {
  prepareRename(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.Range> {
    // Get the word at the cursor position
    const wordRange = document.getWordRangeAtPosition(position, /[\w\-]+/);
    if (!wordRange) return Promise.reject("No variable found at cursor");

    const word = document.getText(wordRange);

    // Check if this word is a valid variable
    const { fmMatch, fmData } = getVariables(document);
    if (!fmMatch) {
      return Promise.reject(
        "This document does not have a front matter. Please add a front matter and variables list."
      );
    } else if (!fmData.variables) {
      return Promise.reject(
        "This document does not have any variables in front matter"
      );
    }
    const variables = fmData.variables;

    // Check if the word is actually a variable
    if (!variables.hasOwnProperty(word)) {
      return Promise.reject("Not a valid variable name");
    }

    return wordRange;
  }

  provideRenameEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string
  ): vscode.ProviderResult<vscode.WorkspaceEdit> {
    const wordRange = document.getWordRangeAtPosition(position, /[\w\-]+/);
    if (!wordRange) return;

    const oldName = document.getText(wordRange);
    const text = document.getText();

    const edit = new vscode.WorkspaceEdit();

    // 1. Find and replace in front matter (YAML definition)
    const { fmMatch } = getVariables(document);
    if (fmMatch) {
      const frontMatterStart = text.indexOf(fmMatch[0]);
      const frontMatterText = fmMatch[0];
      const lines = frontMatterText.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Match "oldName:" at the start of the key
        const keyMatch = new RegExp(
          `^(\\s*)(${escapeRegex(oldName)})(:\\s*)`,
          "g"
        );

        if (keyMatch.test(line)) {
          const lineStart = document.positionAt(
            frontMatterStart +
              frontMatterText.substring(0, frontMatterText.indexOf(line)).length
          ).line;

          const keyStartCol = line.indexOf(oldName);
          const keyStart = new vscode.Position(lineStart, keyStartCol);
          const keyEnd = new vscode.Position(
            lineStart,
            keyStartCol + oldName.length
          );

          edit.replace(
            document.uri,
            new vscode.Range(keyStart, keyEnd),
            newName
          );
          break;
        }
      }
    }

    // 2. Find and replace all {{ variable }} usages in the document
    const templateRegex = new RegExp(
      `\\{\\{\\s*(${escapeRegex(oldName)})\\s*\\}\\}`,
      "g"
    );
    let match: RegExpExecArray | null;

    while ((match = templateRegex.exec(text)) !== null) {
      const varStart = match.index + match[0].indexOf(match[1]);
      const start = document.positionAt(varStart);
      const end = document.positionAt(varStart + match[1].length);

      edit.replace(document.uri, new vscode.Range(start, end), newName);
    }

    return edit;
  }
}

// Helper function to escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
