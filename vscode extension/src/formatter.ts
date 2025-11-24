import * as vscode from "vscode";
import prettier from "prettier";

async function execPrettier(text: string): Promise<string> {
  return await prettier.format(text, { parser: "markdown" });
}

export async function provideDocumentFormattingEdits(
  document: vscode.TextDocument
) {
  const text = document.getText();
  const formatted = await execPrettier(text);
  return [vscode.TextEdit.replace(fullRange(document), formatted)];
}

function fullRange(doc: vscode.TextDocument) {
  return new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(doc.getText().length)
  );
}
