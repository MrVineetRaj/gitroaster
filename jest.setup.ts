import "@testing-library/jest-dom";

export function formatSummary(files: string[]) {
  return `Changed files: ${files.join(", ")}`;
}
