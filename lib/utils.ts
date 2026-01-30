import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function updateAt<T>(arr: T[], index: number, updates: Partial<T>): T[] {
  return arr.map((item, i) => (i === index ? { ...item, ...updates } : item));
}

export function deleteAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

export function hasEmptyKeys(arr: { key: string; value: string }[]): boolean {
  return arr.some(({ key }) => !key.trim());
}

export function keyValueArrayToObject(
  arr: { key: string; value: string }[],
): Record<string, string> {
  const obj: Record<string, string> = {};
  arr.forEach(({ key, value }) => {
    if (key) {
      obj[key] = value;
    }
  });
  return obj;
}

export function stringifyResponseBody(data: string | number | boolean | object | null | undefined): string {
  if (data === undefined || data === null) return "";
  if (typeof data === "string") return data;
  return JSON.stringify(data, null, 2);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
