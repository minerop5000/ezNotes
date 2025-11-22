import * as vscode from "vscode";
import { activateRecurringCommand, RecurringType } from "./recurring";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "eznotes" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposableDaily = vscode.commands.registerCommand(
    "eznotes.openDailyNote",
    () => {
      const cfgPath = vscode.workspace
        .getConfiguration("ezNotes")
        .get<string>("dailyNotesPath");

      if (!cfgPath || typeof cfgPath !== "string") {
        vscode.window.showErrorMessage(
          "ezNotes.dailyNotesPath is not set or not a string."
        );
        return;
      }

      activateRecurringCommand(RecurringType.Daily, cfgPath, context);
    }
  );
  context.subscriptions.push(disposableDaily);

  const disposableWeekly = vscode.commands.registerCommand(
    "eznotes.openWeeklyNote",
    () => {
      const cfgPath = vscode.workspace
        .getConfiguration("ezNotes")
        .get<string>("weeklyNotesPath");

      if (!cfgPath || typeof cfgPath !== "string") {
        vscode.window.showErrorMessage(
          "ezNotes.weeklyNotesPath is not set or not a string."
        );
        return;
      }

      activateRecurringCommand(RecurringType.Weekly, cfgPath, context);
    }
  );
  context.subscriptions.push(disposableWeekly);

  const disposableMonthly = vscode.commands.registerCommand(
    "eznotes.openMonthlyNote",
    () => {
      const cfgPath = vscode.workspace
        .getConfiguration("ezNotes")
        .get<string>("monthlyNotesPath");

      if (!cfgPath || typeof cfgPath !== "string") {
        vscode.window.showErrorMessage(
          "ezNotes.monthlyNotesPath is not set or not a string."
        );
        return;
      }

      activateRecurringCommand(RecurringType.Monthly, cfgPath, context);
    }
  );
  context.subscriptions.push(disposableMonthly);
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log("ezNotes extension is now deactivated.");
}
