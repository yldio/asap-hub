import { AWS } from '@serverless/typescript';
import { asyncFunctions } from './serverless/functions-async';
import { indexerFunctions } from './serverless/functions-indexers';
import apiConfig = require('./serverless');

// Local-only aggregate for `serverless offline`: merges the async and indexer
// functions back into the API service so serverless-offline-aws-eventbridge
// registers their subscriptions and webhook -> indexing flows run end-to-end.
// Never used by CI, packaging or deploys.
const serverlessConfig: AWS = {
  ...apiConfig,
  custom: {
    ...apiConfig.custom,
    // The mock bus the eventBridge subscribers listen on. Publish test events
    // to http://localhost:4010 (bus name asap-events-local).
    'serverless-offline-aws-eventbridge': {
      port: 4010,
    },
  },
  functions: {
    ...apiConfig.functions,
    ...asyncFunctions,
    ...indexerFunctions,
  },
};

export = serverlessConfig;
