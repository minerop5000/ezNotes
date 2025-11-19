/**
 * Replaces time templates in the given string with values from the provided date.
 * @param template string containing time templates ({yyyy}, {yy}, {MM}, {M}, {dd}, {d}, {quarter})
 * @param date
 * @returns string with time templates replaced
 */
export function replaceTimeTemplates(template: string, date: Date): string {
  const yyyy = String(date.getFullYear());
  const yy = yyyy.slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const m = String(date.getMonth() + 1);
  const dd = String(date.getDate()).padStart(2, "0");
  const d = String(date.getDate());
  const quarter = String(Math.floor((date.getMonth() + 3) / 3));

  return template
    .replace(/{yyyy}/g, yyyy)
    .replace(/{yy}/g, yy)
    .replace(/{MM}/g, mm)
    .replace(/{M}/g, m)
    .replace(/{dd}/g, dd)
    .replace(/{d}/g, d)
    .replace(/{quarter}/g, quarter);
}
