// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "llm4lint-vsc" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const get_lints_cmd = vscode.commands.registerCommand('llm4lint-vsc.get_lints', (context) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log(context["path"])
		vscode.window.showInformationMessage('get_lints');
	});
	const init_shell_cmd = vscode.commands.registerCommand('llm4lint-vsc.init_shell', (context) => {
		console.log(context["path"])
		vscode.window.showInformationMessage('Init_shell');
	});

	context.subscriptions.push(get_lints_cmd);
	context.subscriptions.push(init_shell_cmd);
}

// This method is called when your extension is deactivated
export function deactivate() {}
