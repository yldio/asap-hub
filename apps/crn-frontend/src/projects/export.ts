import {
  FetchProjectMilestonesExportOptions,
  ProjectAimExportRow,
  ProjectMilestoneExportRow,
  ProjectMilestonesExportResponse,
} from '@asap-hub/model';
import { format } from 'date-fns';
import type ExcelJS from 'exceljs';

const loadExcelJS = () =>
  import(/* webpackChunkName: "exceljs" */ 'exceljs').then(
    (mod) => mod.default ?? mod,
  );

type GrantType = ProjectMilestoneExportRow['grantType'];

const GRANT_TYPE_LABEL: Record<GrantType, string> = {
  original: 'Original Grant',
  supplement: 'Supplement Grant',
};

const HEADER_FILL = 'FFD9D9D9';
const FONT_NAME = 'Arial';

const BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFB7B7B7' } },
  left: { style: 'thin', color: { argb: 'FFB7B7B7' } },
  bottom: { style: 'thin', color: { argb: 'FFB7B7B7' } },
  right: { style: 'thin', color: { argb: 'FFB7B7B7' } },
};

const formatDate = (value: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : format(date, 'yyyy-MM-dd');
};

type ColumnSpec<T> = {
  header: string;
  width: number;
  wrap?: boolean;
  value: (row: T) => string;
};

const NON_BOLD_HEADERS = new Set([
  'Aim Description',
  'Milestone Description',
  'Articles Linked (DOI)',
  'Created Date',
  'Last Updated',
]);

const aimColumns: ColumnSpec<ProjectAimExportRow>[] = [
  { header: 'Project Title', width: 22, value: (a) => a.projectName },
  {
    header: 'Grant Type',
    width: 16,
    value: (a) => GRANT_TYPE_LABEL[a.grantType] ?? a.grantType,
  },
  { header: 'Aim Number', width: 12, value: (a) => a.aimNumber },
  {
    header: 'Aim Description',
    width: 60,
    wrap: true,
    value: (a) => a.description,
  },
  {
    header: 'Articles Linked (DOI)',
    width: 40,
    wrap: true,
    value: (a) => a.articlesDOI,
  },
  {
    header: 'Created Date',
    width: 14,
    value: (a) => formatDate(a.createdDate),
  },
  {
    header: 'Last Updated',
    width: 14,
    value: (a) => formatDate(a.lastUpdated),
  },
  { header: 'Aim Status', width: 14, value: (a) => a.status },
];

const milestoneColumns: ColumnSpec<ProjectMilestoneExportRow>[] = [
  { header: 'Project Title', width: 22, value: (m) => m.projectName },
  {
    header: 'Grant Type',
    width: 16,
    value: (m) => GRANT_TYPE_LABEL[m.grantType] ?? m.grantType,
  },
  {
    header: 'Milestone Description',
    width: 60,
    wrap: true,
    value: (m) => m.description,
  },
  {
    header: 'Related Aim Number(s)',
    width: 18,
    value: (m) => m.relatedAimNumbers,
  },
  {
    header: 'Articles Linked (DOI)',
    width: 40,
    wrap: true,
    value: (m) => m.articlesDOI,
  },
  {
    header: 'Created Date',
    width: 14,
    value: (m) => formatDate(m.createdDate),
  },
  {
    header: 'Last Updated',
    width: 14,
    value: (m) => formatDate(m.lastUpdated),
  },
  {
    header: 'Milestone Status',
    width: 16,
    value: (m) => m.status,
  },
];

/* eslint-disable no-param-reassign */
const writeSheet = <T>(
  worksheet: ExcelJS.Worksheet,
  rows: ReadonlyArray<T>,
  columns: ColumnSpec<T>[],
): void => {
  worksheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.header,
    width: column.width,
  }));

  const headerRow = worksheet.getRow(1);
  headerRow.height = 36;
  headerRow.eachCell((cell, columnNumber) => {
    if (columnNumber > columns.length) return;
    cell.font = {
      name: FONT_NAME,
      bold: true,
      size: 10,
      color: { argb: 'FF000000' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: HEADER_FILL },
    };
    cell.border = BORDER;
  });

  rows.forEach((row) => {
    const excelRow = worksheet.addRow(
      columns.reduce<Record<string, string>>((acc, column) => {
        acc[column.header] = column.value(row);
        return acc;
      }, {}),
    );

    excelRow.height = 48;
    excelRow.eachCell((cell, columnNumber) => {
      const column = columns[columnNumber - 1];
      if (!column) return;
      cell.border = BORDER;
      cell.font = {
        name: FONT_NAME,
        bold: !NON_BOLD_HEADERS.has(column.header),
        size: 10,
        color: { argb: 'FF000000' },
      };
      const centered = !column.wrap;
      cell.alignment = {
        vertical: 'middle',
        horizontal: centered ? 'center' : 'left',
        wrapText: true,
      };
    });
  });

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  };
};
/* eslint-enable no-param-reassign */

export const buildMilestonesWorkbook = async (
  data: ProjectMilestonesExportResponse,
): Promise<ExcelJS.Workbook> => {
  const ExcelJSModule = await loadExcelJS();
  const workbook = new ExcelJSModule.Workbook();
  workbook.creator = 'ASAP Hub';
  workbook.created = new Date();

  const aimsSheet = workbook.addWorksheet('Aims');
  writeSheet(aimsSheet, data.aims, aimColumns);

  const milestonesSheet = workbook.addWorksheet('Milestones');
  writeSheet(milestonesSheet, data.milestones, milestoneColumns);

  return workbook;
};

export const sanitizeProjectName = (projectName: string): string =>
  projectName
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'project';

export const buildExportFileName = (projectName: string): string =>
  `aims_and_milestones_${sanitizeProjectName(projectName)}_${format(
    new Date(),
    'MM-dd-yyyy',
  )}.xlsx`;

const triggerDownload = (fileName: string, blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadProjectMilestonesXlsx = async (
  projectName: string,
  fetchExport: (
    options: FetchProjectMilestonesExportOptions,
  ) => Promise<ProjectMilestonesExportResponse>,
  options: FetchProjectMilestonesExportOptions = {},
): Promise<void> => {
  const data = await fetchExport(options);
  const workbook = await buildMilestonesWorkbook(data);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  triggerDownload(buildExportFileName(projectName), blob);
};
