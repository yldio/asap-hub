import * as XLSX from 'xlsx';

const headerAliases = ['team', 'team name', 'teams'];

const normalizeHeader = (value: unknown): string =>
  typeof value === 'string'
    ? value.trim().replace(/\s+/g, ' ').toLowerCase()
    : '';

const toCellText = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return typeof value === 'number' ? String(value) : '';
};

// The Team column is found by header so an export from the Hub's analytics
// pages (which emits "Team Name") uploads unedited. A file without a
// recognised header is treated as a bare list, so its first row is data.
const findTeamColumn = (
  firstRow: unknown[] = [],
): { column: number; skipFirstRow: boolean } => {
  const column = firstRow.findIndex((cell) =>
    headerAliases.includes(normalizeHeader(cell)),
  );
  return column === -1
    ? { column: 0, skipFirstRow: false }
    : { column, skipFirstRow: true };
};

export const parseSheet = (data: ArrayBuffer | string): string[] => {
  const workbook =
    typeof data === 'string'
      ? XLSX.read(data, { type: 'string' })
      : XLSX.read(data, { type: 'array' });

  const [firstSheetName] = workbook.SheetNames;
  const sheet = firstSheetName && workbook.Sheets[firstSheetName];
  if (!sheet) {
    return [];
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
  const { column, skipFirstRow } = findTeamColumn(rows[0]);

  return rows
    .slice(skipFirstRow ? 1 : 0)
    .map((row) => toCellText(row[column]))
    .filter(Boolean);
};

// FileReader rather than file.text()/arrayBuffer(): jsdom does not implement
// the Blob methods, so those only work in the browser.
const readFile = (file: File): Promise<ArrayBuffer | string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer | string);
    reader.onerror = () =>
      reject(reader.error ?? new Error(`Could not read ${file.name}`));
    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });

export const parseTeamNames = async (files: File[]): Promise<string[]> => {
  const perFile = await Promise.all(
    files.map(async (file) => parseSheet(await readFile(file))),
  );
  return perFile.flat();
};
