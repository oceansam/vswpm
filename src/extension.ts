// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  function notifyProductivity() {
    vscode.window.showInformationMessage("Im watching still");
  }
  context.subscriptions.push(
    vscode.commands.registerCommand("vslazy.Track Productivity", async () => {
      const productiveResponse = await vscode.window.showInformationMessage(
        "Tracking producitivity now!",
        "Yes",
        "No"
      );

      if (productiveResponse === "No") {
        return;
      }

      setInterval(notifyProductivity, 5000);
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
