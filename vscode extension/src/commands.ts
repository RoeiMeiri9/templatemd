import * as vscode from "vscode";

export function fixQuotes(
  uri: vscode.Uri,
  range: vscode.Range,
  newText: string
) {
  const edit = new vscode.WorkspaceEdit();
  edit.replace(uri, range, newText);
  return vscode.workspace.applyEdit(edit);
}
