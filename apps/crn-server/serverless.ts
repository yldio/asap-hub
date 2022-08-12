import { AWS } from '@serverless/typescript';
import assert from 'assert';

const { NODE_ENV = 'development' } = process.env;

if (NODE_ENV === 'production') {
  [
    'CRN_API_URL',
    'CRN_APP_URL',
    'CRN_AWS_ACM_CERTIFICATE_ARN',
    'CRN_AUTH0_AUDIENCE',
    'CRN_AUTH0_CLIENT_ID',
    'SENTRY_DSN_API',
    'SENTRY_DSN_HANDLERS',
  ].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });
}

const {
  CRN_APP_URL = 'http://localhost:3000',
  CRN_API_URL = 'http://localhost:3333',
  ASAP_HOSTNAME = 'hub.asap.science',
  CRN_AWS_ACM_CERTIFICATE_ARN,
  SLS_STAGE = 'development',
  CI_COMMIT_SHA,
  ALGOLIA_INDEX,
  SENTRY_DSN_API,
  SENTRY_DSN_HANDLERS,
  CRN_AUTH0_AUDIENCE,
  CRN_AUTH0_CLIENT_ID,
  CRN_SQUIDEX_APP_NAME,
  SQUIDEX_BASE_URL,
  CRN_SQUIDEX_API_CLIENT_ID,
  CRN_SQUIDEX_API_CLIENT_SECRET,
  CRN_SQUIDEX_SHARED_SECRET,
} = process.env;

const region = process.env.AWS_REGION as AWS['provider']['region'];
const envAlias = SLS_STAGE === 'production' ? 'prod' : 'dev';
const envRef =
  SLS_STAGE === 'production'
    ? 'prod'
    : SLS_STAGE === 'dev'
    ? 'dev'
    : `CI-${SLS_STAGE}`;
const sentryDsnApi = SENTRY_DSN_API!;
const sentryDsnHandlers = SENTRY_DSN_HANDLERS!;
const auth0ClientId = CRN_AUTH0_CLIENT_ID!;
const auth0Audience = CRN_AUTH0_AUDIENCE!;
const squidexAppName = CRN_SQUIDEX_APP_NAME!;
const squidexBaseUrl = SQUIDEX_BASE_URL!;
const squidexClientId = CRN_SQUIDEX_API_CLIENT_ID!;
const squidexClientSecret = CRN_SQUIDEX_API_CLIENT_SECRET!;
const squidexSharedSecret = CRN_SQUIDEX_SHARED_SECRET!;

const algoliaIndex = ALGOLIA_INDEX
  ? '${env:ALGOLIA_INDEX}'
  : `asap-hub_${envRef}`;
const service = 'asap-hub';
export const plugins = [
  './serverless-plugins/serverless-s3-sync',
  './serverless-plugins/serverless-iam-roles-per-function',
  './serverless-plugins/serverless-webpack',
];

const eventBusSource = 'asap.entity-updated';

const serverlessConfig: AWS = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    architecture: 'arm64',
    timeout: 16,
    memorySize: 512,
    region,
    stage: SLS_STAGE,
    httpApi: {
      payload: '2.0',
      cors: {
        allowedOrigins: [CRN_APP_URL],
        allowCredentials: true,
        allowedMethods: ['options', 'post', 'get', 'put', 'delete', 'patch'],
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
    environment: {
      APP_ORIGIN: CRN_APP_URL,
      DEBUG: SLS_STAGE === 'production' ? '' : 'crn-server,http',
      NODE_ENV: '${env:NODE_ENV}',
      ENVIRONMENT: '${env:SLS_STAGE}',
      LIGHTSTEP_TOKEN: '${env:LIGHTSTEP_TOKEN}',
      SQUIDEX_APP_NAME: squidexAppName,
      SQUIDEX_BASE_URL: squidexBaseUrl,
      SQUIDEX_CLIENT_ID: squidexClientId,
      SQUIDEX_CLIENT_SECRET: squidexClientSecret,
      SQUIDEX_SHARED_SECRET: squidexSharedSecret,
      REGION: '${env:AWS_REGION}',
      CRN_API_URL: '${env:CRN_API_URL}',
      LOG_LEVEL: SLS_STAGE === 'production' ? 'error' : 'info',
      NODE_OPTIONS: '--enable-source-maps',
      ALGOLIA_APP_ID: `\${ssm:algolia-app-id-${envAlias}}`,
      CURRENT_REVISION: CI_COMMIT_SHA
        ? '${env:CI_COMMIT_SHA}'
        : '${env:CURRENT_REVISION}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'secretsmanager:*',
            Resource: {
              'Fn::Join': [
                ':',
                [
                  'arn:aws:secretsmanager',
                  { Ref: 'AWS::Region' },
                  { Ref: 'AWS::AccountId' },
                  'secret',
                  `google-api-credentials-${envAlias}*`,
                ],
              ],
            },
          },
          {
            Effect: 'Allow',
            Action: 'ses:SendTemplatedEmail',
            Resource: ['*'],
            Condition: {
              StringLike: {
                'ses:FromAddress': '*@asap.science',
              },
            },
          },
          {
            Effect: 'Allow',
            Action: 'events:*',
            Resource: {
              'Fn::Join': [
                ':',
                [
                  'arn:aws:events',
                  { Ref: 'AWS::Region' },
                  { Ref: 'AWS::AccountId' },
                  'event-bus/asap-events-${self:provider.stage}',
                ],
              ],
            },
          },
          {
            Effect: 'Allow',
            Action: ['cloudfront:CreateInvalidation'],
            Resource: ['*'],
          },
        ],
      },
    },
  },
  package: {
    individually: true,
    excludeDevDependencies: false,
  },
  custom: {
    apiHostname: new URL(CRN_API_URL).hostname,
    appHostname: new URL(CRN_APP_URL).hostname,
    s3Sync: [
      {
        bucketName: '${self:service}-${self:provider.stage}-frontend',
        deleteRemoved: false,
        localDir: '../crn-frontend/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-auth-frontend',
        bucketPrefix: '.auth',
        localDir: '../crn-auth-frontend/build',
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
    webpack: {
      config: './webpack.config.js',
    },
  },
  functions: {
    apiHandler: {
      handler: './src/handlers/api-handler.apiHandler',
      events: [
        {
          httpApi: {
            method: '*',
            path: '*',
          },
        },
      ],
      environment: {
        SENTRY_DSN: sentryDsnApi,
        AUTH0_AUDIENCE: auth0Audience,
        AUTH0_CLIENT_ID: auth0ClientId,
      },
    },
    auth0FetchByCode: {
      handler: './src/handlers/webhooks/fetch-by-code/handler.handler',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/webhook/users/{code}',
          },
        },
      ],
      environment: {
        AUTH0_CLIENT_ID: auth0ClientId,
        AUTH0_SHARED_SECRET: `\${ssm:auth0-shared-secret-${envAlias}}`,
        ALGOLIA_API_KEY: `\${ssm:algolia-search-api-key-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    auth0ConnectByCode: {
      handler: './src/handlers/webhooks/webhook-connect-by-code.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/users/connections',
          },
        },
      ],
      environment: {
        AUTH0_CLIENT_ID: auth0ClientId,
        AUTH0_SHARED_SECRET: `\${ssm:auth0-shared-secret-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    subscribeCalendar: {
      handler: './src/handlers/calendar/subscribe-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': ['CalendarsCreated', 'CalendarsUpdated'],
            },
          },
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    resubscribeCalendars: {
      handler: './src/handlers/calendar/resubscribe-handler.handler',
      timeout: 120,
      events: [
        {
          schedule: 'cron(0 1 * * ? *)',
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    syncUserOrcid: {
      handler: './src/handlers/user/sync-orcid-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': ['UsersCreated', 'UsersUpdated'],
            },
            retryPolicy: {
              maximumRetryAttempts: 2,
            },
          },
        },
      ],
      environment: {
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    inviteUser: {
      handler: './src/handlers/user/invite-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': ['UsersPublished'],
            },
            retryPolicy: {
              maximumRetryAttempts: 2,
            },
          },
        },
      ],
      environment: {
        SES_REGION: `\${ssm:ses-region-${envAlias}}`,
        EMAIL_SENDER: `\${ssm:email-invite-sender-${envAlias}}`,
        EMAIL_BCC: `\${ssm:email-invite-bcc-${envAlias}}`,
        EMAIL_RETURN: `\${ssm:email-invite-return-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexResearchOutput: {
      handler: './src/handlers/research-output/index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ResearchOutputsPublished',
                'ResearchOutputsUpdated',
                'ResearchOutputsUnpublished',
                'ResearchOutputsDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexUser: {
      handler: './src/handlers/user/index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
                'UsersUpdated',
                'UsersCreated',
                'UsersUnpublished',
                'UsersDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexExternalAuthor: {
      handler: './src/handlers/external-author/index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ExternalAuthorsPublished',
                'ExternalAuthorsUpdated',
                'ExternalAuthorsUnpublished',
                'ExternalAuthorsDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexEvents: {
      handler: './src/handlers/event/index-event-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'EventsPublished',
                'EventsUpdated',
                'EventsUnpublished',
                'EventsDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexUserEvents: {
      handler: './src/handlers/event/index-user-events-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'UsersPublished',
                'UsersUpdated',
                'UsersUnpublished',
                'UsersDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexExternalUserEvents: {
      handler:
        './src/handlers/event/index-external-author-events-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'ExternalAuthorsPublished',
                'ExternalAuthorsUpdated',
                'ExternalAuthorsUnpublished',
                'ExternalAuthorsDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexTeamEvents: {
      handler: './src/handlers/event/index-team-events-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'TeamsPublished',
                'TeamsUpdated',
                'TeamsUnpublished',
                'TeamsDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexGroupEvents: {
      handler: './src/handlers/event/index-group-events-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'GroupsPublished',
                'GroupsUpdated',
                'GroupsUnpublished',
                'GroupsDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexLabUsers: {
      handler: './src/handlers/lab/index-lab-users-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': [
                'LabsPublished',
                'LabsUpdated',
                'LabsUnpublished',
                'LabsDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    eventsUpdated: {
      timeout: 300,
      handler: './src/handlers/webhooks/webhook-events-updated.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/events',
          },
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    runMigrations: {
      handler: './src/handlers/webhooks/webhook-run-migrations.run',
      timeout: 900,
      environment: {
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    rollbackMigrations: {
      handler: './src/handlers/webhooks/webhook-run-migrations.rollback',
      timeout: 900,
      environment: {
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    invalidateCache: {
      handler: './src/handlers/invalidate-cache/invalidate-handler.handler',
      events: [
        {
          s3: {
            bucket: { Ref: 'FrontendBucket' },
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'index',
              },
              {
                suffix: '.html',
              },
            ],
            existing: true,
          },
        },
      ],
      environment: {
        CLOUDFRONT_DISTRIBUTION_ID: {
          Ref: 'CloudFrontDistribution',
        },
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexTeamResearchOutputs: {
      handler:
        './src/handlers/teams/index-team-reasearch-outputs-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': ['TeamsPublished', 'TeamsUpdated', 'TeamsDeleted'],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    indexTeamUsers: {
      handler: './src/handlers/teams/index-team-users-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: [eventBusSource],
              'detail-type': ['TeamsPublished', 'TeamsUpdated', 'TeamsDeleted'],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `${algoliaIndex}`,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    squidexWebhook: {
      handler: './src/handlers/webhooks/webhook-squidex.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/squidex',
          },
        },
      ],
      environment: {
        EVENT_BUS: 'asap-events-${self:provider.stage}',
        EVENT_SOURCE: eventBusSource,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    ...(NODE_ENV === 'production'
      ? {
          cronjobSyncOrcid: {
            handler: './src/handlers/webhooks/cronjob-sync-orcid.handler',
            events: [
              {
                schedule: 'rate(1 hour)', // run every hour
              },
            ],
          },
        }
      : {}),
  },
  resources: {
    Conditions: {
      IsDev: {
        'Fn::Equals': ['${self:provider.stage}', 'dev'],
      },
      IsProd: {
        'Fn::Equals': ['${self:provider.stage}', 'production'],
      },
      IsDevOrProd: {
        'Fn::Or': [
          {
            Condition: 'IsDev',
          },
          {
            Condition: 'IsProd',
          },
        ],
      },
    },
    Resources: {
      HttpApiDomain: {
        Type: 'AWS::ApiGatewayV2::DomainName',
        Properties: {
          DomainName: '${self:custom.apiHostname}',
          DomainNameConfigurations: [
            {
              CertificateArn: CRN_AWS_ACM_CERTIFICATE_ARN,
              EndpointType: 'REGIONAL',
            },
          ],
        },
      },
      HttpApiApiMapping: {
        Type: 'AWS::ApiGatewayV2::ApiMapping',
        DependsOn: ['HttpApiDomain'],
        Properties: {
          ApiId: { Ref: 'HttpApi' },
          ApiMappingKey: '',
          DomainName: '${self:custom.apiHostname}',
          Stage: { Ref: 'HttpApiStage' },
        },
      },
      HttpApiRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${ASAP_HOSTNAME}.`,
          RecordSets: [
            {
              Name: '${self:custom.apiHostname}',
              Type: 'A',
              AliasTarget: {
                DNSName: {
                  'Fn::GetAtt': ['HttpApiDomain', 'RegionalDomainName'],
                },
                HostedZoneId: {
                  'Fn::GetAtt': ['HttpApiDomain', 'RegionalHostedZoneId'],
                },
              },
            },
          ],
        },
      },
      FrontendBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-frontend',
          AccessControl: 'PublicRead',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      AuthFrontendBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-auth-frontend',
          AccessControl: 'PublicRead',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      StorybookBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-storybook',
          AccessControl: 'PublicRead',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
          WebsiteConfiguration: {
            IndexDocument: 'index.html',
          },
        },
      },
      MessagesStaticBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-messages-static',
          AccessControl: 'PublicRead',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      BucketPolicyFrontend: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-frontend',
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': [
                    '',
                    [{ 'Fn::GetAtt': ['FrontendBucket', 'Arn'] }, '/*'],
                  ],
                },
              },
            ],
          },
        },
      },
      BucketPolicyAuthFrontend: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-auth-frontend',
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': [
                    '',
                    [{ 'Fn::GetAtt': ['AuthFrontendBucket', 'Arn'] }, '/*'],
                  ],
                },
              },
            ],
          },
        },
      },
      BucketPolicyStorybook: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-storybook',
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': [
                    '',
                    [{ 'Fn::GetAtt': ['StorybookBucket', 'Arn'] }, '/*'],
                  ],
                },
              },
            ],
          },
        },
      },
      BucketPolicyMessagesStatic: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:service}-${self:provider.stage}-messages-static',
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': [
                    '',
                    [{ 'Fn::GetAtt': ['MessagesStaticBucket', 'Arn'] }, '/*'],
                  ],
                },
              },
            ],
          },
        },
      },
      DataBackupBucket: {
        Type: 'AWS::S3::Bucket',
        Condition: 'IsDevOrProd',
        DeletionPolicy: 'Retain',
        Properties: {
          BucketName: '${self:service}-${self:provider.stage}-data-backup',
          LifecycleConfiguration: {
            Rules: [
              {
                Id: 'delete-after-3-months',
                Status: 'Enabled',
                ExpirationInDays: 90,
              },
            ],
          },
        },
      },
      CloudFrontOriginAccessIdentityFrontend: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'FrontendBucket' },
          },
        },
      },
      CloudFrontOriginAccessIdentityAuthFrontend: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'AuthFrontendBucket' },
          },
        },
      },
      CloudFrontOriginAccessIdentityStorybook: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'StorybookBucket' },
          },
        },
      },
      CloudFrontOriginAccessIdentityMessagesStatic: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'MessagesStaticBucket' },
          },
        },
      },
      CloudFrontDistribution: {
        Type: 'AWS::CloudFront::Distribution',
        DependsOn: [
          'FrontendBucket',
          'AuthFrontendBucket',
          'StorybookBucket',
          'MessagesStaticBucket',
        ],
        Properties: {
          DistributionConfig: {
            Aliases: ['${self:custom.appHostname}'],
            CustomErrorResponses: [
              {
                ErrorCode: 404,
                ResponseCode: 200,
                ResponsePagePath: '/index.html',
              },
            ],
            Origins: [
              {
                DomainName: {
                  'Fn::GetAtt': ['FrontendBucket', 'RegionalDomainName'],
                },
                Id: 's3origin-frontend',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentityFrontend' },
                      ],
                    ],
                  },
                },
              },
              {
                DomainName: {
                  'Fn::GetAtt': ['AuthFrontendBucket', 'RegionalDomainName'],
                },
                Id: 's3origin-auth-frontend',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentityAuthFrontend' },
                      ],
                    ],
                  },
                },
              },
              {
                CustomOriginConfig: {
                  OriginProtocolPolicy: 'http-only',
                },
                DomainName: {
                  'Fn::Select': [
                    '1',
                    {
                      'Fn::Split': [
                        'http://',
                        {
                          'Fn::GetAtt': ['StorybookBucket', 'WebsiteURL'],
                        },
                      ],
                    },
                  ],
                },
                Id: 's3origin-storybook',
              },
              {
                DomainName: {
                  'Fn::GetAtt': ['MessagesStaticBucket', 'RegionalDomainName'],
                },
                Id: 's3origin-messages-static',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentityAuthFrontend' },
                      ],
                    ],
                  },
                },
              },
              {
                CustomOriginConfig: {
                  OriginProtocolPolicy: 'https-only',
                },
                DomainName: {
                  'Fn::Join': [
                    '.',
                    [
                      { Ref: 'HttpApi' },
                      'execute-api',
                      { Ref: 'AWS::Region' },
                      { Ref: 'AWS::URLSuffix' },
                    ],
                  ],
                },
                Id: 'apigw',
              },
            ],
            DefaultCacheBehavior: {
              AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
              CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
              Compress: true,
              DefaultTTL: 3600,
              ForwardedValues: {
                Cookies: {
                  Forward: 'none',
                },
                QueryString: false,
              },
              TargetOriginId: 's3origin-frontend',
              ViewerProtocolPolicy: 'redirect-to-https',
            },
            CacheBehaviors: [
              {
                AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                Compress: true,
                DefaultTTL: 3600,
                ForwardedValues: {
                  Cookies: {
                    Forward: 'none',
                  },
                  QueryString: false,
                },
                PathPattern: '.auth/*',
                TargetOriginId: 's3origin-auth-frontend',
                ViewerProtocolPolicy: 'redirect-to-https',
              },
              {
                AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                Compress: true,
                DefaultTTL: 3600,
                ForwardedValues: {
                  Cookies: {
                    Forward: 'none',
                  },
                  QueryString: true,
                },
                PathPattern: '.storybook/*',
                TargetOriginId: 's3origin-storybook',
                ViewerProtocolPolicy: 'redirect-to-https',
              },
              {
                AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                Compress: true,
                DefaultTTL: 3600,
                ForwardedValues: {
                  Cookies: {
                    Forward: 'none',
                  },
                  QueryString: false,
                },
                PathPattern: '.messages-static/*',
                TargetOriginId: 's3origin-messages-static',
                ViewerProtocolPolicy: 'redirect-to-https',
              },
            ],
            DefaultRootObject: 'index.html',
            Enabled: true,
            PriceClass: 'PriceClass_100',
            ViewerCertificate: {
              AcmCertificateArn: CRN_AWS_ACM_CERTIFICATE_ARN,
              MinimumProtocolVersion: 'TLSv1.2_2018',
              SslSupportMethod: 'sni-only',
            },
          },
        },
      },
      CloudFrontRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${ASAP_HOSTNAME}.`,
          RecordSets: [
            {
              Name: '${self:custom.appHostname}',
              Type: 'A',
              AliasTarget: {
                DNSName: {
                  'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
                },
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-hostedzoneid
                HostedZoneId: 'Z2FDTNDATAQYW2',
              },
            },
          ],
        },
      },
      SubscribeCalendarDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          MessageRetentionPeriod: 1_209_600, // 14 days
          QueueName:
            '${self:service}-${self:provider.stage}-subscribe-calendar-dlq',
        },
      },
      SubscribeCalendarDLQPolicy: {
        Type: 'AWS::SQS::QueuePolicy',
        Properties: {
          PolicyDocument: {
            Id: '${self:service}-${self:provider.stage}-subscribe-calendar-dlq-policy',
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'Publisher-statement-id',
                Effect: 'Allow',
                Principal: {
                  AWS: '*',
                },
                Action: 'sqs:SendMessage',
                Resource: {
                  'Fn::GetAtt': [`SubscribeCalendarDLQ`, 'Arn'],
                },
              },
            ],
          },
          Queues: [
            {
              Ref: `SubscribeCalendarDLQ`,
            },
          ],
        },
      },
    },
    extensions: {
      SubscribeCalendarLambdaFunction: {
        Properties: {
          DeadLetterConfig: {
            TargetArn: {
              'Fn::GetAtt': ['SubscribeCalendarDLQ', 'Arn'],
            },
          },
        },
      },
    },
  },
};

module.exports = serverlessConfig;
