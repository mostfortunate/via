import { status, type HttpStatus } from "http-status";
import { type AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type NumericKeys<T> = Extract<keyof T, number>;
type HttpStatusCode = NumericKeys<HttpStatus>;

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

export function stringifyResponseBody(
  data: string | number | boolean | object | null | undefined,
): string {
  if (data === undefined || data === null) return "";
  if (typeof data === "string") return data;
  return JSON.stringify(data, null, 2);
}

export function isHttpStatusCode(code: number): code is HttpStatusCode {
  return code in status;
}

export function getStatusText(res: AxiosResponse): string {
  if (res.statusText) return res.statusText;
  if (isHttpStatusCode(res.status)) {
    return status[res.status];
  }
  return "Unknown Status";
}

export function getStatusColorClass(code: number) {
  if (code >= 200 && code < 300) return "text-green-500";
  if (code >= 300 && code < 400) return "text-yellow-500";
  if (code >= 400) return "text-red-500";
  return "text-muted-foreground";
};

export type KeyValueRow = { key: string; value: string };

export const isRowEmpty = (row: KeyValueRow) =>
  row.key.trim() === "" && row.value.trim() === "";

export const hasRowValue = (row: KeyValueRow) =>
  row.key.trim() !== "" || row.value.trim() !== "";

export const shouldAppendEmptyRow = <T extends KeyValueRow>(rows: T[]) =>
  rows.length > 0 && rows.every(hasRowValue);

export const appendEmptyRow = <T extends KeyValueRow>(rows: T[]) => [
  ...rows,
  { key: "", value: "" } as T,
];

export const updateKeyValueRows = <T extends KeyValueRow>(
  rows: T[],
  index: number,
  updates: Partial<T>,
) => {
  const updated = updateAt(rows, index, updates);
  const row = updated[index];
  const next = row && isRowEmpty(row) ? deleteAt(updated, index) : updated;
  return shouldAppendEmptyRow(next) ? appendEmptyRow(next) : next;
};

export const deleteKeyValueRow = <T extends KeyValueRow>(
  rows: T[],
  index: number,
) => {
  const next = deleteAt(rows, index);
  return shouldAppendEmptyRow(next) ? appendEmptyRow(next) : next;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
