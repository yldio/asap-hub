import { AWS } from '@serverless/typescript';
import { indexersIamRoleStatements } from './serverless/iam';
import { indexerFunctions } from './serverless/functions-indexers';
import {
  indexersService,
  providerEnvironment,
  region,
  stage,
} from './serverless/shared';

const plugins = [
  './serverless-plugins/serverless-esbuild',
  './serverless-plugins/serverless-iam-roles-per-function',
];

const serverlessConfig: AWS = {
  service: indexersService,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs24.x' as AWS['provider']['runtime'],
    architecture: 'arm64',
    timeout: 16,
    memorySize: 1024,
    region,
    stage,
    versionFunctions: false,
    tracing: {
      lambda: true,
    },
    environment: providerEnvironment,
    iam: {
      role: {
        statements: indexersIamRoleStatements,
      },
    },
  },
  package: {
    individually: true,
    excludeDevDependencies: false,
  },
  custom: {
    esbuild: {
      packager: 'yarn',
      platform: 'node',
      target: 'node24',
      bundle: true,
      concurrency: 4,
    },
  },
  functions: indexerFunctions,
};

module.exports = serverlessConfig;
