import { ProjectMilestonesExportResponse } from '@asap-hub/model';
import * as XLSX from 'xlsx';

jest.mock('xlsx', () => {
  const actual = jest.requireActual('xlsx');
  return {
    ...actual,
    writeFile: jest.fn(),
  };
});

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
      /^aims_and_milestones_Alessi_Project_\d{6}\.xlsx$/,
    );
  });
});

describe('buildMilestonesWorkbook', () => {
  it('writes Aims and Milestones sheets with the agreed columns', () => {
    const workbook = buildMilestonesWorkbook(exportData);

    expect(workbook.SheetNames).toEqual(['Aims', 'Milestones']);

    const aimsSheet = workbook.Sheets.Aims!;
    const aimsRows =
      XLSX.utils.sheet_to_json<Record<string, string>>(aimsSheet);
    expect(aimsRows[0]).toMatchObject({
      'Project Title': 'Alessi Project',
      'Grant Type': 'Original Grant',
      'Aim Number': 'A1',
      'Aim Description': 'Aim description 1',
      'Articles Linked (DOI)': '10.1093/brain/awad214',
      'Created Date': '2026-02-14',
      'Last Updated': '2026-03-21',
      'Aim Status': 'Complete',
    });

    const milestonesSheet = workbook.Sheets.Milestones!;
    const milestoneRows =
      XLSX.utils.sheet_to_json<Record<string, string>>(milestonesSheet);
    expect(milestoneRows[0]).toMatchObject({
      'Project Title': 'Alessi Project',
      'Grant Type': 'Supplement Grant',
      'Milestone Description': 'Milestone description',
      'Related Aim Number(s)': 'A1; A2',
      'Created Date': '2026-03-01',
      'Last Updated': '2026-03-18',
      'Milestone Status': 'In Progress',
    });
  });
});

describe('downloadProjectMilestonesXlsx', () => {
  const writeFile = XLSX.writeFile as jest.MockedFunction<typeof XLSX.writeFile>;

  beforeEach(() => {
    writeFile.mockReset();
  });

  it('passes the requested options to the fetcher and builds the workbook', async () => {
    const fetchExport = jest.fn().mockResolvedValue(exportData);

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
    expect(writeFile).toHaveBeenCalledWith(
      expect.objectContaining({ SheetNames: ['Aims', 'Milestones'] }),
      expect.stringMatching(/^aims_and_milestones_Alessi_Project_\d{6}\.xlsx$/),
    );
  });
});
