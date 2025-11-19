import * as vscode from "vscode";

/**
 * Replaces time templates in the given string with values from the provided date.
 * @param template string containing time templates ({yyyy}, {yy}, {MM}, {M}, {dd}, {d}, {quarter})
 * @param date
 * @returns string with time templates replaced
 */
export function replaceTimeTemplates(template: string, date: Date): string {
  const locale =
    vscode.env.language || Intl.DateTimeFormat().resolvedOptions().locale;

  const yyyy = String(date.getFullYear());
  const yy = yyyy.slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const m = String(date.getMonth() + 1);
  const dd = String(date.getDate()).padStart(2, "0");
  const d = String(date.getDate());
  const quarter = String(Math.floor((date.getMonth() + 3) / 3));
  const ww = String(getWeekNumber(date)).padStart(2, "0");

  return template
    .replace(/{yyyy}/g, yyyy)
    .replace(/{yy}/g, yy)
    .replace(/{MMMM}/g, date.toLocaleDateString(locale, { month: "long" }))
    .replace(/{MMM}/g, date.toLocaleDateString(locale, { month: "short" }))
    .replace(/{MM}/g, mm)
    .replace(/{M}/g, m)
    .replace(/{dddd}/g, date.toLocaleDateString(locale, { weekday: "long" }))
    .replace(/{ddd}/g, date.toLocaleDateString(locale, { weekday: "short" }))
    .replace(/{dd}/g, dd)
    .replace(/{d}/g, d)
    .replace(/{quarter}/g, quarter)
    .replace(/{WW}/g, ww);
}

function getWeekNumber(date: Date): any {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
