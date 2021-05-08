import * as vscode from 'vscode';
import { ClassNameTipType } from '#types';
import Hub from '../hub/index';
import renderTip from './renderTip';

export default class implements vscode.HoverProvider {
  public classLists: Map<string, ClassNameTipType>[] | null;

  constructor(classMapings: Map<string, ClassNameTipType>[]|null,hub:Hub) {
    this.classLists = classMapings;
    if(hub){
        hub.on('update',(e:any)=>{
          this.classLists = e.classNames;
        });
    }
  }

  getTip = (token: string, prefix?: string) => {
        if (!this.classLists) {
            return null;
        };
        const mergeMaps:Map<string, ClassNameTipType> = new Map();
        this.classLists.forEach(item=>{
            item.forEach(item=>{
                mergeMaps.set(item.value,{
                    ...item
                });
            });
        });
        let classesIterator = mergeMaps.entries();
        for (let cls of classesIterator) {
            const [key, config] = cls;
            if (key === token) {
                return config;
            }
        }
    };


	async provideHover(
		doc: vscode.TextDocument,
		pos: vscode.Position,
	) {
		const range = doc.getWordRangeAtPosition(pos, /('|"|`)?[\w-]+/);
		if (range) {
            const prefixRange = range.start.translate(0, 1);
            const prefix = doc.getText(new vscode.Range(prefixRange, range.start));
			const token = doc.getText(new vscode.Range(prefixRange, range.end));
			const tip = this.getTip(token, prefix);
			if (tip) {
				return new vscode.Hover(renderTip(tip));
			}
		}
		return null;
	}
}
