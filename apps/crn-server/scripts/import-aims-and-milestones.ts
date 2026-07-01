import { Entry, getLinkEntity } from '@asap-hub/contentful';
import { MilestoneStatus, milestoneStatuses } from '@asap-hub/model';
import {
  cell,
  col,
  getContentfulEnvironment,
  isEmptyRow,
  readCsv,
  validateRequiredColumns,
} from './import-utils';

const REQUIRED_AIMS_COLUMNS = [
  'Project ID',
  'Project Title',
  'Grant Type',
  'Aim Number',
  'Aim Description',
];

const REQUIRED_MILESTONES_COLUMNS = [
  'Project ID',
  'Project Title',
  'Grant Type',
  'Milestone Description',
  'Related Aim Number(s)',
  'Milestone Status',
];

export type MilestoneStatus = (typeof milestoneStatuses)[number];

type GrantBucket = 'original' | 'supplement';
const GRANT_TYPES: GrantBucket[] = ['original', 'supplement'];

type MilestoneImport = {
  description: string;
  status: string;
  entryId?: string;
};

type AimImport = {
  aimNumber: number;
  description: string;
  milestoneKeys: string[];
  entryId?: string;
};

type ProjectImport = {
  projectId: string;
  title: string;
  aimsByGrantType: Record<GrantBucket, Record<number, AimImport>>;
  milestonesByGrantType: Record<GrantBucket, Record<string, MilestoneImport>>;
  entry?: Entry;
};

const normalizeGrantType = (value: string): GrantBucket => {
  if (GRANT_TYPES.includes(value as GrantBucket)) {
    return value as GrantBucket;
  }
  if (value === 'Original Grant') return 'original';
  if (value === 'Supplement Grant') return 'supplement';
  throw new Error(`Unknown Grant Type: ${value}`);
};

const statusMap = {
  'Not Started': 'Pending',
  Active: 'In Progress',
  Completed: 'Complete',
  Pivoted: 'Terminated',
} as const;

const normalizeMilestoneStatus = (value: string): MilestoneStatus => {
  if (!value) {
    return 'Pending';
  }

  if (milestoneStatuses.includes(value as MilestoneStatus)) {
    return value as MilestoneStatus;
  }

  const normalized = statusMap[value as keyof typeof statusMap];
  if (normalized) {
    return normalized;
  }
  throw new Error(`Unknown Milestone Status: ${value}`);
};

/**
 * Import flow:
 *
 * 1. Read aims and milestones CSV files.
 * 2. Build an in-memory project model by:
 *    - Grouping aims by project and grant type.
 *    - Grouping milestones by project and grant type.
 *    - Linking milestones to their related aims.
 * 3. Resolve each project against an existing Contentful Project entry.
 * 4. For each project:
 *    - Create and publish milestone entries.
 *    - Create and publish aim entries linked to those milestones.
 *    - Update the Project entry with Original Grant aims.
 *    - Update the Supplement Grant entry linked to Project (if present) with Supplement Grant aims.
 *
 * Notes:
 * - Projects must already exist in Contentful.
 * - Aim numbers are expected to be unique within a project.
 * - Milestones are created before aims because aims reference milestone entries.
 */
const app = async () => {
  const aimsCsvPath = process.argv[2];
  const milestonesCsvPath = process.argv[3];
  if (!aimsCsvPath || !milestonesCsvPath) {
    throw new Error(
      'Usage: yarn import:aims-milestones <aims-csv-path> <milestones-csv-path>',
    );
  }

  const env = await getContentfulEnvironment();
  const { rows: aimRows, headers: aimHeaders } = await readCsv(aimsCsvPath);
  const { rows: milestoneRows, headers: milestoneHeaders } =
    await readCsv(milestonesCsvPath);

  validateRequiredColumns(aimHeaders, REQUIRED_AIMS_COLUMNS);
  validateRequiredColumns(milestoneHeaders, REQUIRED_MILESTONES_COLUMNS);

  const aimColumns = {
    projectId: col(aimHeaders, 'Project ID'),
    projectTitle: col(aimHeaders, 'Project Title'),
    grantType: col(aimHeaders, 'Grant Type'),
    aimNumber: col(aimHeaders, 'Aim Number'),
    aimDescription: col(aimHeaders, 'Aim Description'),
  };

  const milestoneColumns = {
    projectId: col(milestoneHeaders, 'Project ID'),
    projectTitle: col(milestoneHeaders, 'Project Title'),
    grantType: col(milestoneHeaders, 'Grant Type'),
    milestoneDescription: col(milestoneHeaders, 'Milestone Description'),
    aimNumbers: col(milestoneHeaders, 'Related Aim Number(s)'),
    status: col(milestoneHeaders, 'Milestone Status'),
  };

  const projects: Record<string, ProjectImport> = {};

  console.log(`\n--- Building in-memory model ---`);

  for (const row of aimRows) {
    if (!isEmptyRow(row)) {
      const projectId = cell(row, aimColumns.projectId);
      const title = cell(row, aimColumns.projectTitle);
      const grantType = normalizeGrantType(cell(row, aimColumns.grantType));
      const aimDescription = cell(row, aimColumns.aimDescription);
      const aimNumber = Number(cell(row, aimColumns.aimNumber));

      let project = projects[projectId];

      if (!project) {
        project = {
          projectId,
          title,
          aimsByGrantType: {
            original: {},
            supplement: {},
          },
          milestonesByGrantType: {
            original: {},
            supplement: {},
          },
        };
        projects[projectId] = project;
      }

      project.aimsByGrantType[grantType][aimNumber] = {
        aimNumber,
        description: aimDescription,
        milestoneKeys: [],
      };
    }
  }

  for (const row of milestoneRows) {
    if (!isEmptyRow(row)) {
      const projectId = cell(row, milestoneColumns.projectId);
      const grantType = normalizeGrantType(
        cell(row, milestoneColumns.grantType),
      );
      const milestoneKey = cell(row, milestoneColumns.milestoneDescription);
      const status = normalizeMilestoneStatus(
        cell(row, milestoneColumns.status),
      );

      const project = projects[projectId];

      if (project) {
        const milestonesBucket = project.milestonesByGrantType[grantType];
        const aimsBucket = project.aimsByGrantType[grantType];

        milestonesBucket[milestoneKey] = {
          description: milestoneKey,
          status,
        };

        const relatedAimNumbers = cell(row, milestoneColumns.aimNumbers)
          .split(',')
          .map((x) => Number(x.trim()));

        for (const aimNumber of relatedAimNumbers) {
          const aim = aimsBucket[aimNumber];

          if (!aim) {
            throw new Error(
              `Milestone "${milestoneKey}" references missing aim ${aimNumber} on project ${projectId}`,
            );
          }

          aim.milestoneKeys.push(milestoneKey);
        }
      } else {
        throw new Error(
          `Milestone references project ${projectId} that does not exist in aims CSV`,
        );
      }
    }
  }

  console.log(`Loaded ${Object.keys(projects).length} projects from CSVs`);

  console.log('\n--- Resolving Contentful projects ---');

  for (const project of Object.values(projects)) {
    const response = await env.getEntries({
      content_type: 'projects',
      'fields.projectId': project.projectId,
    });

    const projectEntry = response.items.find(
      (entry: Entry) => entry.fields.title?.['en-US'] === project.title,
    );

    if (!projectEntry) {
      throw new Error(
        `Could not find project with project id ${project.projectId} and title (${project.title})`,
      );
    }

    project.entry = projectEntry;
  }

  // Import data
  for (const project of Object.values(projects)) {
    console.log(
      `\n=== Importing aims and milestones for project ${project.projectId} (${project.title}) ===`,
    );

    const entry = project.entry;
    if (!entry) throw new Error(`Missing entry for ${project.projectId}`);

    // create project's milestones
    for (const grantType of GRANT_TYPES) {
      const milestones = Object.values(
        project.milestonesByGrantType[grantType],
      );

      console.log(`Creating ${milestones.length} ${grantType} milestones...`);

      for (let i = 0; i < milestones.length; i += 10) {
        const batch = milestones.slice(i, i + 10);

        await Promise.all(
          batch.map(async (milestone) => {
            const milestoneEntry = await env.createEntry('milestones', {
              fields: {
                description: {
                  'en-US': milestone.description,
                },
                status: {
                  'en-US': milestone.status,
                },
                bulkImported: {
                  'en-US': true,
                },
              },
            });

            const publishedMilestone = await milestoneEntry.publish();

            milestone.entryId = publishedMilestone.sys.id;
          }),
        );
      }
    }

    const createGrantAims = async (grantType: GrantBucket) => {
      const aims = Object.values(project.aimsByGrantType[grantType]).sort(
        (a, b) => a.aimNumber - b.aimNumber,
      );

      console.log(`Creating ${grantType} aims (${aims.length})...`);

      for (const aim of aims) {
        const milestoneLinks = aim.milestoneKeys.map((key) => {
          const milestone = project.milestonesByGrantType[grantType][key];

          if (!milestone?.entryId) {
            throw new Error(`Missing entryId for milestone ${key}`);
          }

          return getLinkEntity(milestone.entryId);
        });

        const aimEntry = await env.createEntry('aims', {
          fields: {
            description: { 'en-US': aim.description },
            milestones: { 'en-US': milestoneLinks },
          },
        });

        const published = await aimEntry.publish();
        aim.entryId = published.sys.id;
      }

      return aims;
    };

    const originalAims = await createGrantAims('original');

    entry.fields.originalGrantAims = {
      'en-US': originalAims.map((a) => getLinkEntity(a.entryId!)),
    };

    const supplementAims = await createGrantAims('supplement');

    const supplementGrantLink = entry.fields.supplementGrant?.['en-US'];

    if (supplementGrantLink) {
      const supplementGrant = await env.getEntry(supplementGrantLink.sys.id);
      supplementGrant.fields.aims = {
        'en-US': supplementAims.map((a) => getLinkEntity(a.entryId!)),
      };

      const updatedSupplementGrant = await supplementGrant.update();
      await updatedSupplementGrant.publish();
    } else if (supplementAims.length > 0) {
      console.warn(
        `Project ${project.projectId} has ${supplementAims.length} supplement aims but no supplement grant entry.`,
      );
    }

    const updatedProject = await entry.update();

    await updatedProject.publish();

    console.log(`✓ Completed project ${project.projectId}`);
  }

  console.log('\n--- Import complete ---');
};

app().catch((err) => {
  console.error(err);
  process.exit(1);
});
