import { start } from 'repl';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "cadub" is now active!');
	const dict: { [key: number]: string } = {
		1: '一',
		2: '二',
		3: '三',
		4: '四',
		5: '五',
		6: '六',
		7: '七',
		8: '八',
		9: '九',
		10: '十'
	}

	for (let i = 1; i < 11; i++) {
		const male = vscode.commands.registerCommand(`cadub.setspeaker.m${i}`, () => {
			setSpeaker('男' + dict[i]);
		});
		context.subscriptions.push(male);
		const female = vscode.commands.registerCommand(`cadub.setspeaker.f${i}`, () => {
			setSpeaker('女' + dict[i]);
		});
		context.subscriptions.push(female);
	}
}

function setSpeaker(speakerId: string) {
	//console.log("speaker ID:", speakerId);
	const editor = vscode.window.activeTextEditor;
	//console.log('editor,');
	if (editor) {
		let selection = editor.selection;
		const start = selection.start;
		const end = selection.end;
		let selectedText = editor.document.getText(new vscode.Range(start, end));
		const lineText = editor.document.lineAt(start.line).text;
		//console.log('h:' + lineText);
		let isWholeLineSelected = start.line === end.line && start.character === 0 && end.character === lineText.length;
		if (selectedText.length == 0) {// act like user selected whole line
			const p_start = new vscode.Position(start.line, 0);
			const p_end = new vscode.Position(start.line, editor.document.lineAt(start.line).text.length);
			const newSelection = new vscode.Selection(p_start, p_end);
			selection = newSelection;
			selectedText = editor.document.lineAt(selection.active.line).text;
			isWholeLineSelected = true;
		}


		const startsWithSpeakerPrefix = lineText.startsWith("//speaker:");
		//console.log(selectedText);

		let newText = "";
		if (isWholeLineSelected) {
			if (!startsWithSpeakerPrefix) {
				newText = `//speaker:${speakerId}=${selectedText}`;
			}
			else {
				const re = /\/\/speaker:(.+)=(.+)/
				newText = selectedText.replace(re, `//speaker:${speakerId}=$2`);
			}
		} else {
			newText = `\n\n//speaker:${speakerId}=${selectedText}\n\n`;
		}

		editor.edit(editBuilder => {
			editBuilder.replace(selection, newText);
		});
	}

	vscode.window.showInformationMessage('Hello World from cadub!');
}


export function deactivate() { }
