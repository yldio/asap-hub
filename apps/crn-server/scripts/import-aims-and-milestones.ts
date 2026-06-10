import { Entry, getLinkEntity } from '@asap-hub/contentful';
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
  'Aim Number',
  'Aim Description',
];

const REQUIRED_MILESTONES_COLUMNS = [
  'Project ID',
  'Project Title',
  'Milestone Description',
  'Related Aim Number(s)',
  'Milestone Status',
];

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
  aims: Record<number, AimImport>;
  milestones: Record<string, MilestoneImport>;
  entry?: Entry;
};

/**
 * Import flow:
 *
 * 1. Read aims and milestones CSV files.
 * 2. Build an in-memory project model by:
 *    - Grouping aims by project.
 *    - Grouping milestones by project.
 *    - Linking milestones to their related aims.
 * 3. Resolve each project against an existing Contentful Project entry.
 * 4. For each project:
 *    - Create and publish milestone entries.
 *    - Create and publish aim entries linked to those milestones.
 *    - Update and publish the project entry with links to the newly
 *      created aims.
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
    aimNumber: col(aimHeaders, 'Aim Number'),
    aimDescription: col(aimHeaders, 'Aim Description'),
  };

  const milestoneColumns = {
    projectId: col(milestoneHeaders, 'Project ID'),
    projectTitle: col(milestoneHeaders, 'Project Title'),
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
      const aimDescription = cell(row, aimColumns.aimDescription);
      const aimNumber = Number(cell(row, aimColumns.aimNumber));

      let project = projects[projectId];

      if (!project) {
        project = {
          projectId,
          title,
          aims: {},
          milestones: {},
        };
        projects[projectId] = project;
      }

      project.aims[aimNumber] = {
        aimNumber,
        description: aimDescription,
        milestoneKeys: [],
      };
    }
  }

  for (const row of milestoneRows) {
    if (!isEmptyRow(row)) {
      const projectId = cell(row, milestoneColumns.projectId);
      const milestoneKey = cell(row, milestoneColumns.milestoneDescription);
      const status = cell(row, milestoneColumns.status);

      const project = projects[projectId];

      if (project) {
        project.milestones[milestoneKey] = {
          description: milestoneKey,
          status,
        };

        const relatedAimNumbers = cell(row, milestoneColumns.aimNumbers)
          .split(',')
          .map((x) => Number(x.trim()));

        for (const aimNumber of relatedAimNumbers) {
          const aim = project.aims[aimNumber];

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

  const totalAims = Object.values(projects).reduce(
    (sum, p) => sum + Object.keys(p.aims).length,
    0,
  );

  const totalMilestones = Object.values(projects).reduce(
    (sum, p) => sum + Object.keys(p.milestones).length,
    0,
  );

  console.log(`Found ${totalAims} aims and ${totalMilestones} milestones`);

  console.log('\n--- Resolving Contentful projects ---');

  for (const project of Object.values(projects)) {
    const response = await env.getEntries({
      content_type: 'projects',
      'fields.projectId': project.projectId,
    });

    const projectEntry = response.items.find(
      (entry) => entry.fields.title?.['en-US'] === project.title,
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
    const milestones = Object.values(project.milestones);

    console.log(`Creating ${milestones.length} milestones...`);

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

    const orderedAims = Object.values(project.aims).sort(
      (a, b) => a.aimNumber - b.aimNumber,
    );

    console.log(`Creating ${orderedAims.length} aims...`);
    for (const aim of orderedAims) {
      const milestoneLinks = aim.milestoneKeys.map((milestoneKey) => {
        const milestone = project.milestones[milestoneKey];

        if (!milestone?.entryId) {
          throw new Error(`Missing entryId for milestone "${milestoneKey}"`);
        }

        return getLinkEntity(milestone.entryId);
      });

      const aimEntry = await env.createEntry('aims', {
        fields: {
          description: {
            'en-US': aim.description,
          },
          milestones: {
            'en-US': milestoneLinks,
          },
        },
      });

      const publishedAim = await aimEntry.publish();

      aim.entryId = publishedAim.sys.id;
    }

    const aimLinks = orderedAims.map((aim) => {
      if (!aim.entryId) {
        throw new Error(`Missing entryId for aim ${aim.aimNumber}`);
      }

      return getLinkEntity(aim.entryId);
    });

    const entry = project.entry;

    if (!entry) {
      throw new Error(`Project ${project.projectId} missing Contentful entry`);
    }

    entry.fields.originalGrantAims = {
      'en-US': aimLinks,
    };

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
