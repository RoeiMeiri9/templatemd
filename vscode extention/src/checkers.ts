import * as vscode from "vscode";

export function checkUnrecognizedVariable(
  text: string,
  document: vscode.TextDocument,
  variables: object
) {
  const regex = /\{\{\s?(\S+)\s?\}\}/g;
  const diagnostics: vscode.Diagnostic[] = [];

  const msg = "Unrecognized variable";

  for (const match of text.matchAll(regex)) {
    for (const group of match.slice(1)) {
      if (variables.hasOwnProperty(group)) continue;
      const fullMatchStart = match.index!;

      const groupStartOffset = match[0].indexOf(group);
      const groupStart = fullMatchStart + groupStartOffset;
      const groupEnd = groupStart + group.length;

      const start = document.positionAt(groupStart);
      const end = document.positionAt(groupEnd);

      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          msg,
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  return diagnostics;
}
