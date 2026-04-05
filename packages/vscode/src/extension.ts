import * as vscode from "vscode";
import { provideCompletionItems } from "./completion";
import { EmdDefinitionProvider } from "./EmdDefinitionProvide";
import { provideDocumentFormattingEdits } from "./formatter";
import { EmdRenameProvider } from "./EmdRenameProvider";
import { EmdQuoteFixProvider } from "./EmdQuoteFixProvider";
import { fixQuotes } from "./commands";
import { check as getCheck } from "./validate";

export function activate(context: vscode.ExtensionContext) {
  const fileType = "emd";
  const collections = vscode.languages.createDiagnosticCollection("emd");

  const check = getCheck(collections);

  const provider = vscode.languages.registerCompletionItemProvider(
    fileType,
    {
      provideCompletionItems,
    },
    "{",
  );

  vscode.languages.registerDocumentFormattingEditProvider(fileType, {
    provideDocumentFormattingEdits,
  });

  const definitionProvider = vscode.languages.registerDefinitionProvider(
    fileType,
    new EmdDefinitionProvider(),
  );

  const renameProvider = vscode.languages.registerRenameProvider(
    "emd",
    new EmdRenameProvider(),
  );

  vscode.workspace.textDocuments.forEach(check);

  const onNewOpenedDocument = vscode.workspace.onDidOpenTextDocument(check);

  const onChangedDocument = vscode.workspace.onDidChangeTextDocument((e) =>
    check(e.document),
  );

  const onClosed = vscode.workspace.onDidCloseTextDocument((doc) =>
    collections.delete(doc.uri),
  );

  const quoteFixProvider = vscode.languages.registerCodeActionsProvider(
    "emd",
    new EmdQuoteFixProvider(),
    {
      providedCodeActionKinds: EmdQuoteFixProvider.providedCodeActionKinds,
    },
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("emd.fixQuotes", fixQuotes),
  );

  context.subscriptions.push(
    provider,
    definitionProvider,
    collections,
    onNewOpenedDocument,
    onChangedDocument,
    renameProvider,
    onClosed,
    quoteFixProvider,
  );
}

export function deactivate() {}
