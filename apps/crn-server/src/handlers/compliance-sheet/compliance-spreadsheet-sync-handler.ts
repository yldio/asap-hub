import {
  getJWTCredentialsFactory,
  getSheetNameForRange,
  getWritableSheetsClient,
  SheetsClient,
} from '@asap-hub/server-common';
import { SQSEvent } from 'aws-lambda';

import {
  region,
  complianceLiveSpreadsheetId,
  googleApiCredentialsSecretId,
} from '../../config';
import ManuscriptVersionController from '../../controllers/manuscript-version.controller';
import { getManuscriptVersionsDataProvider } from '../../dependencies/manuscript-versions.dependencies';
import { mapToSheetRow } from '../../utils/compliance-sheet';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const spreadsheetId = complianceLiveSpreadsheetId;

const getIdRowMap = async (
  sheets: Awaited<SheetsClient>,
  sheetName: string,
): Promise<Map<string, number>> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:A`,
  });

  const rows = response.data.values ?? [];
  const map = new Map<string, number>();

  for (let i = 1; i < rows.length; i += 1) {
    const id = rows[i]?.[0];
    if (id) {
      map.set(id, i + 1); // 1-based index
    }
  }

  return map;
};

const syncRows = async (
  sheets: Awaited<SheetsClient>,
  manuscriptVersionIds: string[],
  controller: ManuscriptVersionController,
) => {
  const sheetName = await getSheetNameForRange(sheets, spreadsheetId, 0);
  const idRowMap = await getIdRowMap(sheets, sheetName);

  const manuscriptVersions = await controller.fetchComplianceManuscriptVersions(
    { filter: manuscriptVersionIds },
  );

  const mvMap = new Map(manuscriptVersions.items.map((v) => [v.id, v]));

  const updates: { range: string; values: string[][] }[] = [];
  const appends: string[][] = [];

  for (const id of manuscriptVersionIds) {
    const rowIndex = idRowMap.get(id);
    const mv = mvMap.get(id);

    // Invalid if missing or no manuscript title
    if (!mv || !mv.title) {
      if (rowIndex) {
        updates.push({
          range: `${sheetName}!A${rowIndex}:AV${rowIndex}`,
          values: [Array(48).fill('')],
        });
      }
    } else {
      const row = mapToSheetRow(mv);

      // exists in sheet → update
      if (rowIndex) {
        updates.push({
          range: `${sheetName}!A${rowIndex}:AV${rowIndex}`,
          values: [row],
        });
      } else {
        // new version → append
        appends.push(row);
      }
    }
  }

  // batch update existing rows
  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'RAW',
        data: updates,
      },
    });
  }

  // batch append new rows
  if (appends.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: appends,
      },
    });
  }

  logger.info(
    `Sync complete → updated: ${updates.length}, appended: ${appends.length}`,
  );
};

export const sqsComplianceSheetSyncHandlerFactory =
  (
    sheetsClient: SheetsClient,
    manuscriptVersionController: ManuscriptVersionController,
  ) =>
  async (event: SQSEvent) => {
    const allIds = new Set<string>();

    for (const record of event.Records) {
      const body = JSON.parse(record.body);

      for (const id of body.manuscriptVersionIds ?? []) {
        if (id) {
          allIds.add(id);
        }
      }
    }

    if (allIds.size === 0) {
      logger.debug('No unique manuscript version ids provided, skipping sync');
      return;
    }
    try {
      const sheets = await sheetsClient;

      await syncRows(sheets, [...allIds], manuscriptVersionController);
    } catch (error) {
      logger.error(error, 'Error while syncing manuscript versions');

      throw new Error(
        `Unable to sync manuscript versions [${[...allIds].join(', ')}]`,
      );
    }
  };

const getJWTCredentials = getJWTCredentialsFactory({
  googleApiCredentialsSecretId,
  region,
});

const sheetsClient = getWritableSheetsClient(getJWTCredentials);

export const handler = sentryWrapper(
  sqsComplianceSheetSyncHandlerFactory(
    sheetsClient,
    new ManuscriptVersionController(getManuscriptVersionsDataProvider()),
  ),
);
