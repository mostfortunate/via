import {
  appendEmptyRow,
  deleteKeyValueRow,
  hasRowValue,
  isRowEmpty,
  shouldAppendEmptyRow,
  updateKeyValueRows,
} from "@/lib/utils";

describe("key-value row helpers", () => {
  it("detects empty rows using trimmed values", () => {
    expect(isRowEmpty({ key: "", value: "" })).toBe(true);
    expect(isRowEmpty({ key: " ", value: "" })).toBe(true);
    expect(isRowEmpty({ key: "a", value: "" })).toBe(false);
  });

  it("detects rows with any value", () => {
    expect(hasRowValue({ key: "", value: "" })).toBe(false);
    expect(hasRowValue({ key: " ", value: "" })).toBe(false);
    expect(hasRowValue({ key: "a", value: "" })).toBe(true);
    expect(hasRowValue({ key: "", value: "b" })).toBe(true);
  });

  it("determines when to append an empty row", () => {
    expect(shouldAppendEmptyRow([])).toBe(false);
    expect(
      shouldAppendEmptyRow([
        { key: "a", value: "1" },
        { key: "", value: "" },
      ]),
    ).toBe(false);
    expect(
      shouldAppendEmptyRow([
        { key: "a", value: "1" },
        { key: "b", value: "" },
      ]),
    ).toBe(true);
  });

  it("appends a new empty row", () => {
    const rows = [{ key: "a", value: "1" }];
    const next = appendEmptyRow(rows);
    expect(next).toHaveLength(2);
    expect(next[1]).toEqual({ key: "", value: "" });
    expect(rows).toHaveLength(1);
  });

  it("updates rows and removes a row when it becomes empty", () => {
    const rows = [
      { key: "a", value: "1" },
      { key: "b", value: "2" },
    ];

    const next = updateKeyValueRows(rows, 0, { key: "", value: "" });

    expect(next).toHaveLength(2);
    expect(next[0]).toEqual({ key: "b", value: "2" });
    expect(next[1]).toEqual({ key: "", value: "" });
  });

  it("updates rows and appends when all rows have values", () => {
    const rows = [
      { key: "a", value: "1" },
      { key: "", value: "" },
    ];

    const next = updateKeyValueRows(rows, 1, { key: "b" });

    expect(next).toHaveLength(3);
    expect(next[1]).toEqual({ key: "b", value: "" });
    expect(next[2]).toEqual({ key: "", value: "" });
  });

  it("deletes a row and appends an empty row when needed", () => {
    const rows = [
      { key: "a", value: "1" },
      { key: "b", value: "2" },
    ];

    const next = deleteKeyValueRow(rows, 0);

    expect(next).toHaveLength(2);
    expect(next[0]).toEqual({ key: "b", value: "2" });
    expect(next[1]).toEqual({ key: "", value: "" });
  });

  it("deletes the final row without appending", () => {
    const rows = [{ key: "a", value: "1" }];

    const next = deleteKeyValueRow(rows, 0);

    expect(next).toEqual([]);
  });
});
