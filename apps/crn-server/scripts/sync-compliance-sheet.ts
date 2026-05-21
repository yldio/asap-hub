import { ManuscriptVersionExport } from '@asap-hub/model';
import {
  getJWTCredentialsFactory,
  getSheetNameForRange,
  getWritableSheetsClient,
  SheetsClient,
} from '@asap-hub/server-common';
import {
  awsRegion,
  complianceLiveSpreadsheetId,
  googleApiCredentialsSecretId,
} from '../src/config';
import ManuscriptVersionController from '../src/controllers/manuscript-version.controller';
import { getManuscriptVersionsDataProvider } from '../src/dependencies/manuscript-versions.dependencies';
import {
  COMPLIANCE_SHEET_END_COLUMN,
  mapToSheetRow,
} from '../src/utils/compliance-sheet';
import { paginate } from './opensearch/shared-utils';

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region: awsRegion,
});
const sheetsClient = getWritableSheetsClient(getJWTCredentials);
const spreadsheetId = complianceLiveSpreadsheetId;

const CHUNK_SIZE = 500;

const controller = new ManuscriptVersionController(
  getManuscriptVersionsDataProvider(),
);

const clearSheet = async (sheets: Awaited<SheetsClient>, sheetName: string) => {
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${sheetName}!A2:${COMPLIANCE_SHEET_END_COLUMN}`,
  });

  console.log('Sheet cleared');
};

const writeInChunks = async (
  sheets: Awaited<SheetsClient>,
  sheetName: string,
  rows: string[][],
) => {
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${2 + i}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: chunk,
      },
    });

    console.log(`Wrote rows ${i} - ${i + chunk.length}`);
  }
};

const fetchAllManuscriptVersions = async (
  controller: ManuscriptVersionController,
): Promise<ManuscriptVersionExport[]> => {
  console.log('Fetching manuscript versions from Contentful...');

  const manuscriptVersions = await paginate<ManuscriptVersionExport>(
    (params) =>
      controller.fetchComplianceManuscriptVersions({
        take: params.limit,
        skip: params.skip,
      }),
    100,
  );

  console.log(
    `Fetched ${manuscriptVersions.length} manuscript versions from Contentful.`,
  );

  return manuscriptVersions;
};

const rebuildSheet = async (
  sheets: Awaited<SheetsClient>,
  controller: ManuscriptVersionController,
) => {
  const sheetName = await getSheetNameForRange(sheets, spreadsheetId, 0);
  await clearSheet(sheets, sheetName);

  const manuscriptVersions = await fetchAllManuscriptVersions(controller);

  console.log(`Fetched ${manuscriptVersions.length} manuscript versions`);

  const rows = manuscriptVersions
    .filter((version) => version.title.trim())
    .map(mapToSheetRow);

  await writeInChunks(sheets, sheetName, rows);

  console.log('Rebuild complete');
};

const run = async () => {
  try {
    const sheets = await sheetsClient;

    await rebuildSheet(sheets, controller);
    console.log('Compliance sheet rebuilt successfully!');
  } catch (error) {
    console.error('Error rebuilding compliance sheet', error);
    process.exit(1);
  }
};

run();
