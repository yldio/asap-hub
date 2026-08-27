import * as XLSX from 'xlsx';

import { parseSheet, parseTeamNames } from '../parse-team-list';

const toXlsxBuffer = (rows: unknown[][]): ArrayBuffer => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(rows),
    'Sheet1',
  );
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
};

const csvFile = (contents: string, name = 'teams.csv') =>
  new File([contents], name, { type: 'text/csv' });

const xlsxFile = (rows: unknown[][], name = 'teams.xlsx') =>
  new File([toXlsxBuffer(rows)], name, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

const realFileReader = window.FileReader;

const withFailingFileReader = (error: Error | null) => {
  window.FileReader = function StubFileReader(this: Record<string, unknown>) {
    this.error = error;
    this.readAsText = () => (this.onerror as () => void)();
  } as unknown as typeof FileReader;
};

afterEach(() => {
  window.FileReader = realFileReader;
});

describe('parseSheet', () => {
  it('Should read a CSV with a Team Name header', () => {
    expect(parseSheet('Team Name\nAguzzi\nTeam Alessi\n')).toEqual([
      'Aguzzi',
      'Team Alessi',
    ]);
  });

  it('Should treat the first row as data when no header is recognised', () => {
    expect(parseSheet('Aguzzi\nAlessi\n')).toEqual(['Aguzzi', 'Alessi']);
  });

  it('Should accept Team and Teams as header aliases', () => {
    expect(parseSheet('Team\nAguzzi\n')).toEqual(['Aguzzi']);
    expect(parseSheet('  TEAMS  \nAguzzi\n')).toEqual(['Aguzzi']);
  });

  it('Should use the headed column when it is not the first one', () => {
    expect(
      parseSheet('Email,Team Name\na@b.com,Aguzzi\nc@d.com,Alessi\n'),
    ).toEqual(['Aguzzi', 'Alessi']);
  });

  it('Should keep a quoted comma inside a single name', () => {
    expect(parseSheet('Team Name\n"Aguzzi, Alessi"\n')).toEqual([
      'Aguzzi, Alessi',
    ]);
  });

  it('Should read a semicolon delimited CSV', () => {
    expect(parseSheet('Email;Team Name\na@b.com;Aguzzi\n')).toEqual(['Aguzzi']);
  });

  it('Should tolerate a BOM and CRLF line endings', () => {
    expect(parseSheet('﻿Team Name\r\nAguzzi\r\nAlessi\r\n')).toEqual([
      'Aguzzi',
      'Alessi',
    ]);
  });

  it('Should skip empty rows and blank cells', () => {
    expect(parseSheet('Team Name\nAguzzi\n\n   \nAlessi\n')).toEqual([
      'Aguzzi',
      'Alessi',
    ]);
  });

  it('Should read an XLSX file', () => {
    expect(
      parseSheet(toXlsxBuffer([['Team Name'], ['Aguzzi'], ['Alessi']])),
    ).toEqual(['Aguzzi', 'Alessi']);
  });

  it('Should read numeric team names as text', () => {
    expect(parseSheet(toXlsxBuffer([['Team Name'], [42]]))).toEqual(['42']);
  });

  it('Should treat a non-text header cell as no header at all', () => {
    expect(parseSheet(toXlsxBuffer([[42], ['Aguzzi']]))).toEqual([
      '42',
      'Aguzzi',
    ]);
  });

  it('Should return nothing for a sheet with no rows', () => {
    expect(parseSheet('')).toEqual([]);
  });

  it('Should ignore every sheet after the first', () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([['Team Name'], ['Aguzzi']]),
      'First',
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([['Team Name'], ['Ignored']]),
      'Second',
    );

    expect(
      parseSheet(XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })),
    ).toEqual(['Aguzzi']);
  });

  // XLSX.read always yields at least one sheet, so the guard against a
  // sheetless workbook is only reachable with the reader stubbed out.
  it('Should return nothing for a workbook with no sheet', async () => {
    jest.resetModules();
    jest.doMock('xlsx', () => ({
      ...jest.requireActual('xlsx'),
      read: () => ({ SheetNames: [], Sheets: {} }),
    }));

    const isolated = await import('../parse-team-list');
    expect(isolated.parseSheet('')).toEqual([]);

    jest.dontMock('xlsx');
    jest.resetModules();
  });
});

describe('parseTeamNames', () => {
  it('Should concatenate names across files in order', async () => {
    await expect(
      parseTeamNames([
        csvFile('Team Name\nAguzzi\n', 'first.csv'),
        xlsxFile([['Team Name'], ['Alessi']], 'second.xlsx'),
      ]),
    ).resolves.toEqual(['Aguzzi', 'Alessi']);
  });

  it('Should return nothing when no files are given', async () => {
    await expect(parseTeamNames([])).resolves.toEqual([]);
  });

  it('Should reject with the error the reader reports', async () => {
    const error = new Error('unreadable');
    withFailingFileReader(error);

    await expect(parseTeamNames([csvFile('Team Name\nAguzzi\n')])).rejects.toBe(
      error,
    );
  });

  it('Should reject with a fallback error when the reader gives none', async () => {
    withFailingFileReader(null);

    await expect(
      parseTeamNames([csvFile('Team Name\nAguzzi\n', 'broken.csv')]),
    ).rejects.toThrow('Could not read broken.csv');
  });
});
