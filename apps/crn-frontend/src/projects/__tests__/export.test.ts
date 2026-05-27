import { ProjectMilestonesExportResponse } from '@asap-hub/model';
import ExcelJS from 'exceljs';
import {
  buildExportFileName,
  buildMilestonesWorkbook,
  downloadProjectMilestonesXlsx,
  sanitizeProjectName,
} from '../export';

const exportData: ProjectMilestonesExportResponse = {
  aims: [
    {
      projectName: 'Alessi Project',
      grantType: 'original',
      aimNumber: 'A1',
      description: 'Aim description 1',
      articlesDOI: '10.1093/brain/awad214',
      createdDate: '2026-02-14T00:00:00Z',
      lastUpdated: '2026-03-21T00:00:00Z',
      status: 'Complete',
    },
  ],
  milestones: [
    {
      projectName: 'Alessi Project',
      grantType: 'supplement',
      description: 'Milestone description',
      relatedAimNumbers: 'A1; A2',
      articlesDOI: '',
      createdDate: '2026-03-01T00:00:00Z',
      lastUpdated: '2026-03-18T00:00:00Z',
      status: 'In Progress',
    },
  ],
};

describe('sanitizeProjectName', () => {
  it('replaces whitespace and punctuation with underscores', () => {
    expect(sanitizeProjectName('Alessi Project / 2026!')).toBe(
      'Alessi_Project_2026',
    );
  });

  it('falls back to "project" when input has no valid characters', () => {
    expect(sanitizeProjectName('  !! ')).toBe('project');
  });
});

describe('buildExportFileName', () => {
  it('produces the agreed naming pattern', () => {
    const fileName = buildExportFileName('Alessi Project');
    expect(fileName).toMatch(
      /^aims_and_milestones_Alessi_Project_\d{2}-\d{2}-\d{4}\.xlsx$/,
    );
  });
});

describe('buildMilestonesWorkbook', () => {
  it('writes Aims and Milestones sheets with the agreed columns and styles', async () => {
    const workbook = await buildMilestonesWorkbook(exportData);

    expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual([
      'Aims',
      'Milestones',
    ]);

    const aimsSheet = workbook.getWorksheet('Aims');
    expect(aimsSheet).toBeDefined();
    const aimHeader = aimsSheet!.getRow(1);
    expect(aimHeader.getCell(1).value).toBe('Project Title');
    expect(aimHeader.getCell(8).value).toBe('Aim Status');
    expect(aimHeader.getCell(1).font?.bold).toBe(true);
    expect(aimHeader.getCell(1).fill).toMatchObject({
      type: 'pattern',
      pattern: 'solid',
    });

    const aimDataRow = aimsSheet!.getRow(2);
    expect(aimDataRow.getCell(2).value).toBe('Original Grant');
    expect(aimDataRow.getCell(3).value).toBe('A1');
    expect(aimDataRow.getCell(6).value).toBe('2026-02-14');
    expect(aimDataRow.getCell(8).value).toBe('Complete');
    expect(aimDataRow.getCell(8).font?.bold).toBe(true);
    expect(aimDataRow.getCell(4).font?.bold).toBe(false);
    expect(aimDataRow.getCell(5).font?.bold).toBe(false);
    expect(aimDataRow.getCell(6).font?.bold).toBe(false);
    expect(aimDataRow.getCell(7).font?.bold).toBe(false);

    const milestonesSheet = workbook.getWorksheet('Milestones');
    expect(milestonesSheet).toBeDefined();
    const milestoneDataRow = milestonesSheet!.getRow(2);
    expect(milestoneDataRow.getCell(2).value).toBe('Supplement Grant');
    expect(milestoneDataRow.getCell(4).value).toBe('A1; A2');
    expect(milestoneDataRow.getCell(8).value).toBe('In Progress');

    expect(aimsSheet!.autoFilter).toMatchObject({
      from: { row: 1, column: 1 },
    });
  });
});

describe('downloadProjectMilestonesXlsx', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const createObjectURL = jest.fn(() => 'blob:fake');
  const revokeObjectURL = jest.fn();

  beforeAll(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });
  });

  afterAll(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: originalCreateObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: originalRevokeObjectURL,
    });
  });

  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
  });

  it('passes the requested options to the fetcher and builds the workbook', async () => {
    const fetchExport = jest.fn().mockResolvedValue(exportData);
    const writeBufferSpy = jest
      .spyOn(ExcelJS.Workbook.prototype.xlsx, 'writeBuffer')
      .mockResolvedValue(new ArrayBuffer(0));
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    await downloadProjectMilestonesXlsx('Alessi Project', fetchExport, {
      grantType: 'supplement',
      search: 'alpha',
      filter: ['Complete'],
      sort: 'aim_desc',
    });

    expect(fetchExport).toHaveBeenCalledWith({
      grantType: 'supplement',
      search: 'alpha',
      filter: ['Complete'],
      sort: 'aim_desc',
    });
    expect(writeBufferSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    writeBufferSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it('defaults to an empty options object when none is provided', async () => {
    const fetchExport = jest.fn().mockResolvedValue(exportData);
    const writeBufferSpy = jest
      .spyOn(ExcelJS.Workbook.prototype.xlsx, 'writeBuffer')
      .mockResolvedValue(new ArrayBuffer(0));
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    await downloadProjectMilestonesXlsx('Alessi Project', fetchExport);

    expect(fetchExport).toHaveBeenCalledWith({});

    writeBufferSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
