import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { ExportType } from "@/types/preference";

interface ExportToExcelProps<T> {
  data: T[];
  selectedFields: string[];
  filename: string;
  exportType?: ExportType;
}

/**
 * Flattens nested objects and arrays into a single-level object with dot notation keys
 * Arrays are converted to comma-separated strings or expanded into multiple columns
 */
function flattenValue(
  value: unknown,
  key: string,
  flatObj: Record<string, unknown>
) {
  if (value === null || value === undefined) {
    flatObj[key] = "";
    return;
  }

  // Handle Date objects
  if (value instanceof Date) {
    flatObj[key] = value.toISOString();
    return;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      flatObj[key] = "";
      return;
    }

    // Check if array contains primitive values
    const isPrimitiveArray = value.every(
      (item) =>
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean" ||
        item === null
    );

    if (isPrimitiveArray) {
      // Join primitive arrays with comma
      flatObj[key] = value
        .filter((v) => v !== null && v !== undefined)
        .join(", ");
    } else {
      // For array of objects, create separate columns for each item
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          // Flatten each object in the array
          Object.keys(item).forEach((subKey) => {
            flattenValue(
              (item as Record<string, unknown>)[subKey],
              `${key}[${index}].${subKey}`,
              flatObj
            );
          });
        } else {
          flatObj[`${key}[${index}]`] = item;
        }
      });
    }
    return;
  }

  // Handle nested objects
  if (typeof value === "object" && value !== null) {
    Object.keys(value).forEach((subKey) => {
      flattenValue(
        (value as Record<string, unknown>)[subKey],
        `${key}.${subKey}`,
        flatObj
      );
    });
    return;
  }

  // Handle primitive values
  flatObj[key] = value;
}

/**
 * Converts a data item into a flattened object suitable for Excel export
 */
function flattenDataItem<T extends Record<string, unknown>>(
  item: T,
  selectedFields: string[]
): Record<string, unknown> {
  const flatItem: Record<string, unknown> = {};

  selectedFields.forEach((field) => {
    const value = item[field];
    flattenValue(value, field, flatItem);
  });

  return flatItem;
}

/**
 * Formats column headers to be more readable
 */
function formatHeader(header: string): string {
  return header
    .replace(/\[(\d+)\]/g, " $1") // Replace [0] with " 0"
    .replace(/\./g, " ") // Replace dots with spaces
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function exportToExcel<T extends Record<string, unknown>>({
  data,
  selectedFields,
  filename,
  exportType,
}: ExportToExcelProps<T>) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Flatten all data items
  const flattenedRows = data.map((item) =>
    flattenDataItem(item, selectedFields)
  );

  // Get all unique headers from all rows (in case different rows have different nested structures)
  const allHeaders = new Set<string>();
  flattenedRows.forEach((row) => {
    Object.keys(row).forEach((key) => allHeaders.add(key));
  });

  // Convert to array and maintain the order based on selectedFields
  const orderedHeaders: string[] = [];
  selectedFields.forEach((field) => {
    allHeaders.forEach((header) => {
      if (
        header === field ||
        header.startsWith(field + ".") ||
        header.startsWith(field + "[")
      ) {
        if (!orderedHeaders.includes(header)) {
          orderedHeaders.push(header);
        }
      }
    });
  });

  // Ensure all rows have all columns (fill missing with empty strings)
  const normalizedRows = flattenedRows.map((row) => {
    const normalizedRow: Record<string, unknown> = {};
    orderedHeaders.forEach((header) => {
      normalizedRow[header] = row[header] !== undefined ? row[header] : "";
    });
    return normalizedRow;
  });

  // Create workbook and worksheet using ExcelJS
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Add header row with formatted names
  const formattedHeaders = orderedHeaders.map((header) => formatHeader(header));
  worksheet.addRow(formattedHeaders);

  // Style the header row - Kantumruy Pro, Bold, 12pt
  const headerRow = worksheet.getRow(1);
  headerRow.font = {
    name: exportType?.header?.font,
    size: exportType?.header?.size,
  };
  headerRow.height = 20;
  headerRow.alignment = { vertical: "middle", horizontal: "left" };

  // Add data rows
  normalizedRows.forEach((row) => {
    const rowData = orderedHeaders.map((header) => row[header]);
    worksheet.addRow(rowData);
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Skip header row
      row.font = {
        name: exportType?.content?.font,
        size: exportType?.content?.size,
      };
      row.alignment = { vertical: "middle", horizontal: "left" };
    }
  });

  // Auto-size columns based on content
  worksheet.columns = orderedHeaders.map((header) => {
    const headerLength = formatHeader(header).length;
    const maxContentLength = Math.max(
      ...normalizedRows.map((row) => {
        const value = row[header];
        return value ? String(value).length : 0;
      })
    );
    const width = Math.min(Math.max(headerLength, maxContentLength, 10), 50);

    return {
      key: header,
      width: width,
    };
  });

  // Generate Excel file buffer
  const excelBuffer = await workbook.xlsx.writeBuffer();

  // Create blob and download
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Ensure filename has .xlsx extension
  const finalFilename = filename.endsWith(".xlsx")
    ? filename
    : `${filename}.xlsx`;
  saveAs(blob, finalFilename);
}
