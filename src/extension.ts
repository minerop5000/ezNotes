import * as path from "path";
import * as vscode from "vscode";
import { replaceTimeTemplates } from "./utils";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "eznotes" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "eznotes.openDailyNote",
    () => {
      if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage("Please open a folder first.");
        return;
      }

      const cfgPath = vscode.workspace
        .getConfiguration("ezNotes")
        .get<string>("dailyNotesPath");

      if (!cfgPath || typeof cfgPath !== "string") {
        vscode.window.showErrorMessage(
          "ezNotes.dailyNotesPath is not set or not a string."
        );
        return;
      }

      const today = new Date();
      const resolvedPath = replaceTimeTemplates(cfgPath, today);

      // Resolve to an absolute URI. If the resolved path is absolute, use it directly,
      // otherwise interpret it relative to the first workspace folder.
      const workspaceFolder = vscode.workspace.workspaceFolders![0].uri.fsPath;
      const fileUri = path.isAbsolute(resolvedPath)
        ? vscode.Uri.file(resolvedPath)
        : vscode.Uri.joinPath(
            vscode.Uri.file(workspaceFolder),
            ...resolvedPath.split(/[\\/]/)
          );

      // If the resolved path is a directory-like (ends with / or no extension), build today's filename
      let targetUri = fileUri;
      const hasExtension = path.extname(fileUri.fsPath) !== "";
      if (!hasExtension) {
        const fileName = `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.md`;
        targetUri = vscode.Uri.joinPath(fileUri, fileName);
      }

      vscode.workspace.fs.stat(targetUri).then(
        () => vscode.window.showTextDocument(targetUri),
        () => {
          // if file does not exist, create it
          // use the template if exists
          const templatePath = vscode.workspace
            .getConfiguration("ezNotes")
            .get<string>("templatePath");

          if (!templatePath || typeof templatePath !== "string") {
            vscode.window.showWarningMessage(
              "ezNotes.templatePath is not set. Creating an empty note."
            );
            vscode.workspace.fs
              .writeFile(targetUri, new Uint8Array())
              .then(() => {
                vscode.window.showTextDocument(targetUri);
              });
            return;
          }

          // read daily.md from templatePath
          const workspaceFolder2 =
            vscode.workspace.workspaceFolders![0].uri.fsPath;
          const templateFileUri = path.isAbsolute(templatePath || "")
            ? vscode.Uri.file(templatePath!)
            : vscode.Uri.joinPath(
                vscode.Uri.file(workspaceFolder2),
                ...(templatePath ? templatePath.split(/[\\/]/) : []),
                "daily.md"
              );

          vscode.workspace.fs.readFile(templateFileUri).then(
            (data) => {
              const text = new TextDecoder().decode(data);
              const replaced = replaceTimeTemplates(text, today);
              const encoded = new TextEncoder().encode(replaced);
              vscode.workspace.fs
                .writeFile(targetUri, encoded)
                .then(() => vscode.window.showTextDocument(targetUri));
            },
            () => {
              // if template daily.md not found, create empty note
              vscode.window.showWarningMessage(
                "Template daily.md not found. Creating an empty note."
              );
              vscode.workspace.fs
                .writeFile(targetUri, new Uint8Array())
                .then(() => vscode.window.showTextDocument(targetUri));
            }
          );
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
