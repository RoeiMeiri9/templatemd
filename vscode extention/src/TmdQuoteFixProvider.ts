import * as vscode from "vscode";

export class TmdQuoteFixProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<Array<vscode.Command>> {
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
    const fix = new vscode.CodeAction(
      "Remove quotes from variable value",
      vscode.CodeActionKind.QuickFix
    );

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
