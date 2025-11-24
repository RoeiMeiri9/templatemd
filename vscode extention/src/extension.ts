import * as vscode from "vscode";
import { provideCompletionItems } from "./completion";
import { TmdDefinitionProvider } from "./TmdDefinitionProvide";
import { provideDocumentFormattingEdits } from "./formatter";
import { checkIllegalRegex, checkUnrecognizedVariable } from "./errors";
import { getVariables } from "./tools";

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

  vscode.workspace.textDocuments.forEach(check);

  const onNewOpenedDocument = vscode.workspace.onDidOpenTextDocument(check);

  const onChangedDocument = vscode.workspace.onDidChangeTextDocument((e) =>
    check(e.document)
  );

  const onClosed = vscode.workspace.onDidCloseTextDocument((doc) =>
    collections.delete(doc.uri)
  );

  context.subscriptions.push(
    provider,
    definitionProvider,
    collections,
    onNewOpenedDocument,
    onChangedDocument,
    onClosed
  );

  function check(document: vscode.TextDocument) {
    let diagnostics: vscode.Diagnostic[] = [];
    if (document.languageId !== "tmd") return;

    const text = document.getText();

    diagnostics.push(...checkIllegalRegex(text, document));

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
