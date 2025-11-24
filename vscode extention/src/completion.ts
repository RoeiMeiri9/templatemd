import {
  CompletionItem,
  CompletionItemKind,
  Position,
  SnippetString,
  TextDocument,
} from "vscode";
import { getVariablesForBraces } from "./tools";

export function provideCompletionItems(
  document: TextDocument,
  position: Position
) {
  return Object.keys(
    getVariablesForBraces(document, position)?.variables ?? {}
  ).map((key) => {
    const item = new CompletionItem(key, CompletionItemKind.Variable);

    item.insertText = new SnippetString(key);

    return item;
  });
}
