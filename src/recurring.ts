import path from "path";
import * as vscode from "vscode";
import { replaceTimeTemplates } from "./utils";

export enum RecurringType {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}

/**
 * Activate the recurring note command.
 * @param type
 * @param cfgPath
 */
export function activateRecurringCommand(type: RecurringType, cfgPath: string) {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage("Please open a folder first.");
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
    () => {
      // if file exists, open it
      vscode.window.showTextDocument(targetUri);
      runUserDefinedCommand(type, targetUri, false);
    },
    () => {
      // if file does not exist, create it
      createRecurringNote(type, targetUri, today);
      runUserDefinedCommand(type, targetUri);
    }
  );
}

/**
 * Use template to create a recurring note and then open it.
 * @param type
 * @param targetUri
 * @param date
 */
function createRecurringNote(
  type: RecurringType,
  targetUri: vscode.Uri,
  date: Date
) {
  // Check if templatePath is set
  const templatePath = vscode.workspace
    .getConfiguration("ezNotes")
    .get<string>("templatePath");

  if (!templatePath || typeof templatePath !== "string") {
    vscode.window.showWarningMessage(
      "ezNotes.templatePath is not set. Creating an empty note."
    );
    vscode.workspace.fs.writeFile(targetUri, new Uint8Array()).then(() => {
      vscode.window.showTextDocument(targetUri);
    });
    return;
  }

  // read template.md from templatePath
  const workspaceFolder2 = vscode.workspace.workspaceFolders![0].uri.fsPath;
  let fileName: string;
  switch (type) {
    case RecurringType.Daily:
      fileName = "daily.md";
      break;
    case RecurringType.Weekly:
      fileName = "weekly.md";
      break;
    case RecurringType.Monthly:
      fileName = "monthly.md";
      break;
  }

  const templateFileUri = path.isAbsolute(templatePath || "")
    ? vscode.Uri.file(templatePath!)
    : vscode.Uri.joinPath(
        vscode.Uri.file(workspaceFolder2),
        ...(templatePath ? templatePath.split(/[\\/]/) : []),
        fileName
      );

  vscode.workspace.fs.readFile(templateFileUri).then(
    (data) => {
      const text = new TextDecoder().decode(data);
      const replaced = replaceTimeTemplates(text, date);
      const encoded = new TextEncoder().encode(replaced);
      vscode.workspace.fs
        .writeFile(targetUri, encoded)
        .then(() => vscode.window.showTextDocument(targetUri));
    },
    () => {
      // if template not found, create empty note
      vscode.window.showWarningMessage(
        `Template ${fileName} not found. Creating an empty note.`
      );
      vscode.workspace.fs
        .writeFile(targetUri, new Uint8Array())
        .then(() => vscode.window.showTextDocument(targetUri));
    }
  );
}

/**
 * Reads command setting and runs it in terminal.
 * @param type
 * @param targetUri
 */
function runUserDefinedCommand(
  type: RecurringType,
  targetUri: vscode.Uri,
  onCreated = true
) {
  let settingKey: string;
  switch (type) {
    case RecurringType.Daily:
      settingKey = "ezNotes.daily";
      break;
    case RecurringType.Weekly:
      settingKey = "ezNotes.weekly";
      break;
    case RecurringType.Monthly:
    default:
      settingKey = "ezNotes.monthly";
      break;
  }
  settingKey += onCreated ? "PostCreateCommand" : "PostSwitchCommand";

  const command = vscode.workspace
    .getConfiguration()
    .get<string>(settingKey, "")
    .trim();

  if (!command) {
    return;
  }

  // simple placeholders: {file}, {path}, {dir}, {filename}
  const filePath = targetUri.fsPath;
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  const resolvedCommand = command
    .replace(/{file}|{path}/g, filePath)
    .replace(/{dir}/g, dir)
    .replace(/{filename}/g, fileName);

  const term = vscode.window.createTerminal("ezNotes Post Create");
  term.sendText(resolvedCommand, true);
}
