// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { readStorage, writeStorage } from "./lib/vsUtil";

export function activate(context: vscode.ExtensionContext) {
  const TIME_LIMIT_SECONDS = 60;

  async function setHighscore(highWpm: number) {
    await writeStorage("highScore", highWpm, context);
    vscode.window.showInformationMessage(`New highscore saved: ${highWpm}wpm`);
  }

  /**
   * Determine words per minute and notify the extension owner of their
   * new score.
   * @param totalCharacters total characters typed during the time period
   *
   */
  async function notifyWPM(totalCharacters: number) {
    const lastScore = await readStorage("highScore", context);
    const newWpm = totalCharacters / 5 / (TIME_LIMIT_SECONDS / 60);

    // previous session detected update highscore
    if (lastScore) {
      // Highscore achieved update accordingly
      if (lastScore > newWpm) {
        setHighscore(newWpm);
      } else {
        vscode.window.showInformationMessage(
          `WPM Achieved: ${newWpm}wpm. \n ${
            lastScore - newWpm
          }wpm away from beating your highscore!`
        );
      }
    } else {
      setHighscore(newWpm);
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("vswpm.wpmcount", async () => {
      const productiveResponse = await vscode.window.showInformationMessage(
        "Would you like to track your wpm?",
        "Yes",
        "No"
      );

      if (productiveResponse === "No") {
        return;
      }
      vscode.window.showInformationMessage(
        "Now tracking WPM for the next minute."
      );
      let changedCharacters = 0;
      vscode.workspace.onDidChangeTextDocument(
        (e: vscode.TextDocumentChangeEvent) => {
          e.contentChanges.forEach(
            (content) => (changedCharacters += content.text.length)
          );
        }
      );
      setTimeout(() => notifyWPM(changedCharacters), TIME_LIMIT_SECONDS * 1000);
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
