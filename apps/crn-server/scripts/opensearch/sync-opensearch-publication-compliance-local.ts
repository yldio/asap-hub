import {
  awsRegion,
  environment,
  opensearchPassword,
  opensearchUsername,
} from '../../src/config';
import { indexOpensearchData } from '@asap-hub/server-common';

import { metricConfig } from './constants';
import { exportPublicationComplianceData } from './publication-compliance';

const exportPublicationComplianceToOpensearch = async () => {
  console.log(`Starting export for metric: publication-compliance`);
  console.log('OpenSearch Username:', opensearchUsername);
  console.log('OpenSearch Password:', opensearchPassword ? '***' : 'undefined');

  const config = metricConfig['publication-compliance'];

  const documents = await exportPublicationComplianceData('local');

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
    `Successfully indexed ${documents.length} documents for metric: publication-compliance`,
  );
};

const run = async () => {
  try {
    await exportPublicationComplianceToOpensearch();
    console.log('Publication compliance data export completed successfully');
  } catch (error) {
    console.error('Error during publication compliance data export:', error);
    process.exit(1);
  }
};

run();
