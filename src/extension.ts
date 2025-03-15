import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {
	let llm_diagnostics = vscode.languages.createDiagnosticCollection("LLM4Lint");
	const get_lints_cmd = vscode.commands.registerCommand('llm4lint-vsc.get_lints', (cmd_context) => {
		llm_diagnostics.clear();
		const prompt = "Perform linting on the given code. Specify output in format: <line_number> - <type>: <issue>\n";
		let file_uri = vscode.Uri.file(cmd_context["path"]);

		// perform inference using ollama and then display diagnostics
		vscode.workspace.openTextDocument(file_uri).then(async (document) => {
			let code = document.getText();
			let code_lines = code.split("\n");
			let code_with_lines = "";
			for (let index = 0; index < code_lines.length; index++) {
				const line = code_lines[index];
				code_with_lines += String(index+1) + "   " + line + "\n";
			}
			const output_lines = new Set<String>();
			// multi-sampling inference to account for non-deterministic outputs
			for(let i=0; i<4; ++i) {
				const response = await ollama.chat({
					model: 'llm4lint7b',
					messages: [{ role: 'user', content: prompt + code_with_lines }],
				})
				const output_text = response.message.content.split("\n")
				for (const line of output_text) {
					output_lines.add(line);
				}
			}
			// display diagnostics
			let _diagnostics = [];
			const _severity = vscode.DiagnosticSeverity.Warning;
			const max_lines = code_lines.length;
			for (const line of output_lines) {
				const lno = Number(line.at(0));
				if (lno > max_lines) {
					continue
				}
				else if (!isNaN(lno)) {
					const start_char = code_lines.at(lno)?.charAt(0)
					let end_char = code_lines.at(lno)?.length
					end_char ??= 0
					const file_diagnostic = new vscode.Diagnostic(new vscode.Range(lno-1,0,lno-1,end_char), line.slice(4), _severity);
					_diagnostics.push(file_diagnostic);
				}
			}
			if ((_diagnostics.length) == 0) {
				vscode.window.showInformationMessage("Clean Code: No Issues Detected");
			}
			llm_diagnostics.set(file_uri, _diagnostics);
			context.subscriptions.push(llm_diagnostics);
		});
		vscode.window.showInformationMessage('Linting...');
	});
	const init_shell_cmd = vscode.commands.registerCommand('llm4lint-vsc.init_shell', (cmd_context) => {
		const script = "llm4lint " + "-i " + cmd_context["path"];
		let terminal = vscode.window.createTerminal({
			name: "LLM4Lint-7B",
			hideFromUser: false,
		});
		terminal.sendText(script)
		terminal.show()
		vscode.window.showInformationMessage("If Shell fails to launch install using: 'pip install llm4lint'");
	});
	const clear_lints = vscode.commands.registerCommand('llm4lint-vsc.clear_lints', (cmd_context) => {
		llm_diagnostics.clear();
	});

	context.subscriptions.push(get_lints_cmd);
	context.subscriptions.push(init_shell_cmd);
}

export function deactivate() {}
