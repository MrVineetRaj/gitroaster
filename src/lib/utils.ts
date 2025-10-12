import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import JSON5 from "json5";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCompactTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

export function parseJson(obj: string | null) {
  if (!obj) {
    return null;
  }
  if (!obj.includes("```json")) {
    const parsed = JSON5.parse(obj);
    return JSON.stringify(parsed);
  }
  const jsonMatch = obj.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    const jsonStr = jsonMatch[1];
    const parsed = JSON5.parse(jsonStr);
    console.log(parsed);
    return JSON.stringify(parsed);
  } else {
    return null;
  }
}
