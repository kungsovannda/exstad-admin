
// This is for filter in data table
// utils/buildUniqueOptions.ts
export function buildUniqueOptions<T>(
  data: T[],
  extractor: (item: T) => string | number | undefined
) {
  return Array.from(new Set(data.map(extractor).filter(Boolean))).map((value) => ({
    label: String(value),
    value: String(value), // always string for select options
  }));
}