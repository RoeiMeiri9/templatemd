import * as vscode from "vscode";
import * as yaml from "js-yaml";

export function activate(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider(
    "tmd", // your language ID
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        // Get front-matter YAML
        const text = document.getText();
        const fmMatch = text.match(/^---\r\n([\s\S]*?)\r\n---/);
        if (!fmMatch) return [];

        const fmContent = fmMatch[1];
        let fmData: any;
        try {
          fmData = yaml.load(fmContent);
        } catch {
          return [];
        }

        const variables = fmData.variables || {};

        const line = document.lineAt(position).text;
        const beforeCursor = line.slice(0, position.character);

        const alreadyHasOpen = beforeCursor.endsWith("{{");

        // Return CompletionItems
        return Object.keys(variables).map((key) => {
          const item = new vscode.CompletionItem(
            key,
            vscode.CompletionItemKind.Variable
          );
          item.insertText = new vscode.SnippetString(
            alreadyHasOpen ? `${key}` : `{${key}}`
          );

          return item;
        });
      },
    },
    "{" // trigger character
  );

  context.subscriptions.push(provider);
}

export function deactivate() {}
