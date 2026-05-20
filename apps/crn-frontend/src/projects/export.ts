import {
  FetchProjectMilestonesExportOptions,
  ProjectAimExportRow,
  ProjectMilestoneExportRow,
  ProjectMilestonesExportResponse,
} from '@asap-hub/model';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const GRANT_TYPE_LABEL: Record<
  ProjectMilestoneExportRow['grantType'],
  string
> = {
  original: 'Original Grant',
  supplement: 'Supplement Grant',
};

const formatDate = (value: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : format(date, 'yyyy-MM-dd');
};

const aimRow = (aim: ProjectAimExportRow) => ({
  'Project Title': aim.projectName,
  'Grant Type': GRANT_TYPE_LABEL[aim.grantType] ?? aim.grantType,
  'Aim Number': aim.aimNumber,
  'Aim Description': aim.description,
  'Articles Linked (DOI)': aim.articlesDOI,
  'Created Date': formatDate(aim.createdDate),
  'Last Updated': formatDate(aim.lastUpdated),
  'Aim Status': aim.status,
});

const milestoneRow = (milestone: ProjectMilestoneExportRow) => ({
  'Project Title': milestone.projectName,
  'Grant Type': GRANT_TYPE_LABEL[milestone.grantType] ?? milestone.grantType,
  'Milestone Description': milestone.description,
  'Related Aim Number(s)': milestone.relatedAimNumbers,
  'Articles Linked (DOI)': milestone.articlesDOI,
  'Created Date': formatDate(milestone.createdDate),
  'Last Updated': formatDate(milestone.lastUpdated),
  'Milestone Status': milestone.status,
});

export const buildMilestonesWorkbook = (
  data: ProjectMilestonesExportResponse,
): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(data.aims.map(aimRow)),
    'Aims',
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(data.milestones.map(milestoneRow)),
    'Milestones',
  );
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
    'MMddyy',
  )}.xlsx`;

export const downloadProjectMilestonesXlsx = async (
  projectName: string,
  fetchExport: (
    options: FetchProjectMilestonesExportOptions,
  ) => Promise<ProjectMilestonesExportResponse>,
  options: FetchProjectMilestonesExportOptions = {},
): Promise<void> => {
  const data = await fetchExport(options);
  const workbook = buildMilestonesWorkbook(data);
  XLSX.writeFile(workbook, buildExportFileName(projectName));
};
