import * as vscode from "vscode";
import { provideCompletionItems } from "./completion";
import { TmdDefinitionProvider } from "./TmdDefinitionProvide";
import { provideDocumentFormattingEdits } from "./formatter";
import { checkUnrecognizedVariable } from "./checkers";
import { getVariables } from "./tools";
import { TmdRenameProvider } from "./TmdRenameProvider";
import { TmdQuoteFixProvider } from "./TmdQuoteFixProvider";
import { fixQuotes } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  const fileType = "tmd";
  const collections = vscode.languages.createDiagnosticCollection("tmd");

  const provider = vscode.languages.registerCompletionItemProvider(
    fileType,
    {
      provideCompletionItems,
    },
    "{"
  );

  vscode.languages.registerDocumentFormattingEditProvider(fileType, {
    provideDocumentFormattingEdits,
  });

  const definitionProvider = vscode.languages.registerDefinitionProvider(
    fileType,
    new TmdDefinitionProvider()
  );

  const renameProvider = vscode.languages.registerRenameProvider(
    "tmd",
    new TmdRenameProvider()
  );

  vscode.workspace.textDocuments.forEach(check);

  const onNewOpenedDocument = vscode.workspace.onDidOpenTextDocument(check);

  const onChangedDocument = vscode.workspace.onDidChangeTextDocument((e) =>
    check(e.document)
  );

  const onClosed = vscode.workspace.onDidCloseTextDocument((doc) =>
    collections.delete(doc.uri)
  );

  const quoteFixProvider = vscode.languages.registerCodeActionsProvider(
    "tmd",
    new TmdQuoteFixProvider(),
    {
      providedCodeActionKinds: TmdQuoteFixProvider.providedCodeActionKinds,
    }
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tmd.fixQuotes", fixQuotes)
  );

  context.subscriptions.push(
    provider,
    definitionProvider,
    collections,
    onNewOpenedDocument,
    onChangedDocument,
    renameProvider,
    onClosed,
    quoteFixProvider
  );

  function check(document: vscode.TextDocument) {
    let diagnostics: vscode.Diagnostic[] = [];
    if (document.languageId !== "tmd") return;

    const text = document.getText();

    const { fmData } = getVariables(document);
    if (fmData?.variables) {
      diagnostics.push(
        ...checkUnrecognizedVariable(text, document, fmData.variables)
      );
    }

    collections.set(document.uri, diagnostics);
  }
}

export function deactivate() {}
