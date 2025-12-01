# ezNotes

ezNotes is a simple extension to create and navigate fast to daily/weekly notes in your workspace.

Works good in combination with `foam.foam-vscode` and tries to replace and improve upon the daily notes feature of Foam.

## Features

- Create daily notes based on a template.
- Navigate to today's note quickly.
- Customizable note storage location.
- Post-creation & update commands for further automation.

## Extension Settings

This extension contributes the following settings:

- `ezNotes.dailyNotesPath`: Path to store daily notes.
- `ezNotes.templatePath`: Path to the template file for daily notes.
  - Files used in template path:
    - `daily.md`: Template for daily notes.
    - `weekly.md`: Template for weekly notes.
    - `monthly.md`: Template for monthly notes.

### Date replacement patterns

Paths and template contents support the following date replacement patterns:

- `{yyyy}`: 4-digit year (e.g., 2024)
- `{yy}`: 2-digit year (e.g., 24)
- `{quarter}`: Quarter of the year (1-4)
- `{MMMM}`: Full month name (e.g., January)
- `{MMM}`: Short month name (e.g., Jan)
- `{MM}`: 2-digit month (e.g., 01, 12)
- `{M}`: 1 or 2-digit month (e.g., 1, 12)
- `{WW}`: 2-digit ISO week number (e.g., 01, 52)
- `{dddd}`: Full name of the day (e.g., Monday)
- `{ddd}`: Short name of the day (e.g., Mon)
- `{dd}`: 2-digit day (e.g., 01, 31)
- `{d}`: 1 or 2-digit day (e.g., 1, 31)

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
