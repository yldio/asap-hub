import * as XLSX from 'xlsx';

export type ParsedTeamRow = { name: string; attended: boolean };

const teamHeaderAliases = ['team', 'team name', 'teams'];
const attendanceHeaderAliases = [
  'attendance',
  'attended',
  'status',
  'present',
];
const attendedValues = new Set([
  'yes',
  'y',
  'true',
  '1',
  'attended',
  'present',
]);

const normalizeCell = (value: unknown): string =>
  typeof value === 'string'
    ? value.trim().replace(/\s+/g, ' ').toLowerCase()
    : typeof value === 'number'
      ? String(value)
      : '';

const toCellText = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return typeof value === 'number' ? String(value) : '';
};

// Blank or unrecognised status defaults to not attended.
// SheetJS coerces TRUE/FALSE cells to real booleans, so handle those directly.
const parseAttended = (value: unknown): boolean =>
  typeof value === 'boolean'
    ? value
    : attendedValues.has(normalizeCell(value));

const findColumns = (
  firstRow: unknown[] = [],
): { teamColumn: number; attendanceColumn: number; skipFirstRow: boolean } => {
  const teamHeader = firstRow.findIndex((cell) =>
    teamHeaderAliases.includes(normalizeCell(cell)),
  );
  const attendanceColumn = firstRow.findIndex((cell) =>
    attendanceHeaderAliases.includes(normalizeCell(cell)),
  );
  const hasHeader = teamHeader !== -1 || attendanceColumn !== -1;
  return {
    teamColumn: teamHeader === -1 ? 0 : teamHeader,
    attendanceColumn,
    skipFirstRow: hasHeader,
  };
};

export const parseSheet = (data: ArrayBuffer | string): ParsedTeamRow[] => {
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
  const { teamColumn, attendanceColumn, skipFirstRow } = findColumns(rows[0]);

  return rows
    .slice(skipFirstRow ? 1 : 0)
    .map((row) => ({
      name: toCellText(row[teamColumn]),
      attended:
        attendanceColumn === -1 ? false : parseAttended(row[attendanceColumn]),
    }))
    .filter((row) => row.name);
};

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

export const parseTeamRows = async (
  files: File[],
): Promise<ParsedTeamRow[]> => {
  const perFile = await Promise.all(
    files.map(async (file) => parseSheet(await readFile(file))),
  );
  return perFile.flat();
};
