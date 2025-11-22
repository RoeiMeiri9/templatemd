import * as vscode from "vscode";
import * as yaml from "js-yaml";
import { getVariables } from "./tools";

export class TmdDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.Definition> {
    const wordRange = document.getWordRangeAtPosition(
      position,
      /[\w\-]+/ // adjust if variable names allow more chars
    );
    if (!wordRange) return;

    const word = document.getText(wordRange);

    const { fmMatch, text } = getVariables(document, position);

    if (!fmMatch || !text) return;

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
    if (definitionLine === -1) return;

    // Compute absolute line number
    const realLine =
      document.positionAt(frontMatterStart).line + definitionLine;

    return new vscode.Location(document.uri, new vscode.Position(realLine, 0));
  }
}
