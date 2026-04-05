import { validateEmd } from "@emd/core";
import { coreToVSDiag } from "./translators/diagnostics";
import * as vscode from "vscode";

export const check =
  (collections: vscode.DiagnosticCollection) =>
  (document: vscode.TextDocument) => {
    if (document.languageId !== "emd") return;

    const text = document.getText();
    const validateDiag = validateEmd(text);
    const diagnostics = coreToVSDiag(document, validateDiag);

    collections.set(document.uri, diagnostics);
  };
