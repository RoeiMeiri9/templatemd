import * as vscode from "vscode";
import { provideCompletionItems } from "./completion";
import { TmdDefinitionProvider } from "./TmdDefinitionProvide";

export function activate(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider(
    "tmd",
    {
      provideCompletionItems,
    },
    "{" // trigger character
  );

  const definitionProvider = vscode.languages.registerDefinitionProvider(
    "tmd",
    new TmdDefinitionProvider()
  );

  context.subscriptions.push(provider, definitionProvider);
}

export function deactivate() {}
