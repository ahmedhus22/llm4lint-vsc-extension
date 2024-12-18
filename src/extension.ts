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
	const get_lints_cmd = vscode.commands.registerCommand('llm4lint-vsc.get_lints', (cmd_context) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let llm_diagnostics = vscode.languages.createDiagnosticCollection("LLM4Lint")
		console.log(cmd_context["path"])
		let file_uri = vscode.Uri.file(cmd_context["path"])
		//new vscode.DiagnosticRelatedInformation(new vscode.Location(file_uri, new vscode.Position(1,1)), "testing")
		let file_diagnostic = new vscode.Diagnostic(new vscode.Range(1,1,1,1), "testing")
		llm_diagnostics.set(file_uri, [file_diagnostic])
		context.subscriptions.push(llm_diagnostics)
		vscode.window.showInformationMessage('get_lints');
	});
	const init_shell_cmd = vscode.commands.registerCommand('llm4lint-vsc.init_shell', (cmd_context) => {
		console.log(cmd_context["path"])
		vscode.window.showInformationMessage('Init_shell');
	});

	context.subscriptions.push(get_lints_cmd);
	context.subscriptions.push(init_shell_cmd);
}

// This method is called when your extension is deactivated
export function deactivate() {}
