import * as vscode from 'vscode';
import Hub from '../hub/index';
import { Snippet } from '#types';


export default class SnippetsCompletionProvider implements vscode.CompletionItemProvider {
    public classList: vscode.CompletionItem[] = [];
    constructor(snippetMapings: Map<string, Snippet>[] | null,hub:Hub) {
      if (snippetMapings) {
        this.convertPalettes(snippetMapings);
      }
      if(hub){
        hub.on('update',(e:any)=>{
          this.convertPalettes(e.snippets);
        });
      }
    }

    convertPalettes(classMapings: Map<string, Snippet>[]){
      if (classMapings) {
        this.classList=[];
        classMapings.forEach(item=>{
            item.forEach((cls, key) => {
                const { prefix, description, content } = cls;
                this.classList.push({
                  label: `${prefix}`,
                  kind: 14,
                  detail: description,
                  insertText: new vscode.SnippetString(content)
                });
              });
        });
      }
    }

    provideCompletionItems(
      doc: vscode.TextDocument,
      pos: vscode.Position,
      token: vscode.CancellationToken,
      context: vscode.CompletionContext,
    ) {
      return this.classList;
    }

    resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken) {
      return item;
    }
  }
