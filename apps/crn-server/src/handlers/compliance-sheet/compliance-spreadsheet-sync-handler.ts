import {
  getJWTCredentialsFactory,
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
): Promise<Map<string, number>> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A:A',
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
  const idRowMap = await getIdRowMap(sheets);

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
          range: `Sheet1!A${rowIndex}:AV${rowIndex}`,
          values: [Array(48).fill('')],
        });
      }
    } else {
      const row = mapToSheetRow(mv);

      // exists in sheet → update
      if (rowIndex) {
        updates.push({
          range: `Sheet1!A${rowIndex}:AU${rowIndex}`,
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
      range: 'Sheet1!A:A',
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
    await Promise.all(
      event.Records.map(async (record) => {
        const body = JSON.parse(record.body);
        const { manuscriptVersionIds } = body;

        if (!manuscriptVersionIds || manuscriptVersionIds.length === 0) {
          logger.debug('No manuscriptVersionIds provided, skipping sync');
          return;
        }

        try {
          const sheets = await sheetsClient;

          await syncRows(
            sheets,
            manuscriptVersionIds,
            manuscriptVersionController,
          );
        } catch (error) {
          logger.error(error, 'Error while syncing manuscript versions');

          throw new Error(
            `Unable to sync manuscript versions [${manuscriptVersionIds}]`,
          );
        }
      }),
    );
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
