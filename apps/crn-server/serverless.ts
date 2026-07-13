import { AWS } from '@serverless/typescript';
import { apiIamRoleStatements } from './serverless/iam';
import { apiFunctions } from './serverless/functions-api';
import { apiResources, conditions } from './serverless/resources-api';
import {
  apiUrl,
  appUrl,
  offlineSSM,
  opensearchDomainName,
  providerEnvironment,
  region,
  s3SyncEnabled,
  service,
  stage,
} from './serverless/shared';

export const plugins = [
  './serverless-plugins/serverless-esbuild',
  './serverless-plugins/serverless-iam-roles-per-function',
  ...(s3SyncEnabled ? ['./serverless-plugins/serverless-s3-sync'] : []),
];
const offlinePlugins = [
  './serverless-plugins/serverless-offline',
  './serverless-plugins/serverless-offline-ssm',
  './serverless-plugins/serverless-offline-aws-eventbridge',
];

if (stage === 'local') {
  plugins.push(...offlinePlugins);
}

const serverlessConfig: AWS = {
  service,
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
    httpApi: {
      payload: '2.0',
      cors: {
        allowedOrigins:
          stage === 'local'
            ? ['http://localhost:3000', 'http://127.0.0.1:3000']
            : [appUrl],
        allowCredentials: true,
        allowedMethods: ['OPTIONS', 'POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: [
          'authorization',
          'x-transaction-id',
          'content-type',
          'accept',
          'origin',
        ],
      },
    },
    logs: {
      httpApi: {
        format:
          '{ "requestId":"$context.requestId", "ip": "$context.identity.sourceIp", "requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod", "path":"$context.path", "routeKey":"$context.routeKey", "status":"$context.status","protocol":"$context.protocol", "responseLength":"$context.responseLength", "integrationRequestId": "$context.integration.requestId", "functionResponseStatus": "$context.integration.status" }',
      },
    },
    tracing: {
      apiGateway: true,
      lambda: true,
    },
    environment: providerEnvironment,
    iam: {
      role: {
        statements: apiIamRoleStatements,
      },
    },
  },
  package: {
    individually: true,
    excludeDevDependencies: false,
  },
  custom: {
    apiHostname: new URL(apiUrl).hostname,
    appHostname: new URL(appUrl).hostname,
    opensearchDomainName,
    s3Sync: [
      {
        bucketName: '${self:service}-${self:provider.stage}-frontend',
        deleteRemoved: false,
        localDir: '../crn-frontend/dist',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-auth-frontend',
        bucketPrefix: '.auth',
        localDir: '../crn-auth-frontend/dist',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-storybook',
        bucketPrefix: '.storybook',
        localDir: '../storybook/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-messages-static',
        deleteRemoved: false,
        bucketPrefix: '.messages-static',
        localDir: '../crn-messages/build-templates/static',
      },
    ],
    esbuild: {
      packager: 'yarn',
      platform: 'node',
      target: 'node24',
      bundle: true,
      concurrency: 4,
    },
    'serverless-offline-ssm': {
      stages: ['local'],
      ssm: offlineSSM,
    },
    'serverless-offline': {
      // only used for local development, no actions will be taken on the files bucket
      httpPort: 3333,
      corsAllowOrigin: 'http://localhost:3000,http://127.0.0.1:3000',
      corsAllowHeaders:
        'authorization,x-transaction-id,content-type,accept,origin',
      corsAllowCredentials: true,
      useWorkerThreads: false,
    },
    apiGateway5xxTopic:
      '${self:service}-${self:provider.stage}-topic-api-gateway-5xx',
  },
  functions: apiFunctions,
  resources: {
    Conditions: conditions,
    Resources: apiResources,
  },
};

module.exports = serverlessConfig;
