import { Diagnostic, Status } from "@emd/core";
import * as vscode from "vscode";

export function coreToVSDiag(
  document: vscode.TextDocument,
  diagnostics: Diagnostic[],
): vscode.Diagnostic[] {
  const vscodeDiagnostics: vscode.Diagnostic[] = [];
  diagnostics.forEach((diagnostic) => {
    if (diagnostic.position && diagnostic.length) {
      const position =
        (diagnostic.namePosition
          ? diagnostic.namePosition
          : diagnostic.position) || 0;
      const start = document.positionAt(position);
      const end = document.positionAt(position + diagnostic.length);

      vscodeDiagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(start, end),
          diagnostic.message,
          diagnostic.level === Status.ERROR
            ? vscode.DiagnosticSeverity.Error
            : vscode.DiagnosticSeverity.Warning,
        ),
      );
    }
  });
  return vscodeDiagnostics;
}
