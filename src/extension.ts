import * as vscode from 'vscode';
import Hub from './hub/index';
import CSSCompletionProvider from './completion/css';
import SnippetsCompletionProvider from './completion/snippets';
import CSSHoverProvider from './hover/css';

export async function activate(context: vscode.ExtensionContext) {

	const dataHub = new Hub();

	const { classNames, snippets } = await dataHub.getConfig();


	/**
	 * file ext support
	 */
	const selectors = [
		{ scheme: 'file', language: 'javascript' },
		{ scheme: 'file', language: 'typescript' },
		{ scheme: 'file', language: 'typescriptreact' },
		{ scheme: 'file', language: 'javascriptreact' }
	];

	/**
	 * classNames triggers
	 */
	const classTriggers =[
		'"',
		"'",
		"''",
		'`',
		'',
		' '];

	if(classNames){
		context.subscriptions.push(
			vscode.languages.registerHoverProvider(
				selectors,
				new CSSHoverProvider(classNames,dataHub),
			),
			vscode.languages.registerCompletionItemProvider(
				selectors,
				new CSSCompletionProvider(classNames,dataHub),
				...classTriggers
			)
		);
	}

	if(snippets){
		context.subscriptions.push(
			vscode.languages.registerCompletionItemProvider(
				selectors,
				new SnippetsCompletionProvider(snippets,dataHub)
			),
		);
	}
}

export function deactivate() {}
