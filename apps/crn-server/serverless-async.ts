import { AWS } from '@serverless/typescript';
import { asyncIamRoleStatements } from './serverless/iam';
import { asyncFunctions } from './serverless/functions-async';
import { asyncExtensions, asyncResources } from './serverless/resources-async';
import {
  asyncService,
  providerEnvironment,
  region,
  stage,
} from './serverless/shared';

const plugins = [
  './serverless-plugins/serverless-esbuild',
  './serverless-plugins/serverless-iam-roles-per-function',
];

const serverlessConfig: AWS = {
  service: asyncService,
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
        statements: asyncIamRoleStatements,
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
  functions: asyncFunctions,
  resources: {
    Resources: asyncResources,
    extensions: asyncExtensions,
  },
};

module.exports = serverlessConfig;
