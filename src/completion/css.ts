import * as vscode from 'vscode';
import Hub from '../hub/index';
import { ClassNameTipType } from '../types';


export default class CSSCompletionProvider implements vscode.CompletionItemProvider {
    public classList: vscode.CompletionItem[] = [];
    constructor(classMapings: Map<string, ClassNameTipType>[] | null,hub:Hub) {
      if (classMapings) {
        this.convertPalettes(classMapings);
      }
      if(hub){
        hub.on('update',(e:any)=>{
          this.convertPalettes(e.classNames);
        });
      }
    }

    convertPalettes(classMapings: Map<string, ClassNameTipType>[]){
      if (classMapings) {
        this.classList=[];
        classMapings.forEach(item=>{
            item.forEach((cls, key) => {
                const { value, comment } = cls;
                this.classList.push({
                  label: `${value}`,
                  kind: 1,
                  detail: comment,
                  insertText: new vscode.SnippetString(key)
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
