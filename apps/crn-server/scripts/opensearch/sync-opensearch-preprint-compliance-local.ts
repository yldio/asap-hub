import {
  awsRegion,
  environment,
  opensearchPassword,
  opensearchUsername,
} from '../../src/config';
import { indexOpensearchData } from '@asap-hub/server-common';

import { metricConfig } from './constants';
import { exportPreprintComplianceData } from './preprint-compliance';

const exportPreprintComplianceToOpensearch = async () => {
  console.log(`Starting export for metric: preprint-compliance`);

  const config = metricConfig['preprint-compliance'];

  const documents = await exportPreprintComplianceData('local');

  await indexOpensearchData({
    awsRegion,
    stage: environment,
    opensearchUsername,
    opensearchPassword,
    indexAlias: config.indexAlias,
    getData: async () => ({
      documents,
      mapping: config.mapping,
    }),
  });

  console.log(
    `Successfully indexed ${documents.length} documents for metric: preprint-compliance`,
  );
};

const run = async () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log('Environment variables needed:');
    console.log(
      '- GOOGLE_SERVICE_ACCOUNT_KEY: JSON string with service account credentials',
    );
    process.exit(1);
  }

  try {
    await exportPreprintComplianceToOpensearch();
    console.log('Preprint compliance data exported successfully!');
  } catch (error) {
    console.error('Error exporting preprint compliance data:', error);
    process.exit(1);
  }
};

run();
