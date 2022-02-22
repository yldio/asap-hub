import { AWS } from '@serverless/typescript';
import assert from 'assert';
import { paramCase } from 'param-case';
import pkg from './package.json';

const { NODE_ENV = 'development' } = process.env;

if (NODE_ENV === 'production') {
  ['ASAP_API_URL', 'ASAP_APP_URL', 'AWS_ACM_CERTIFICATE_ARN'].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });
}

const {
  ASAP_APP_URL = 'http://localhost:3000',
  ASAP_API_URL = 'http://localhost:3333',
  ASAP_HOSTNAME = 'hub.asap.science',
  AWS_ACM_CERTIFICATE_ARN,
  SLS_STAGE = 'development',
  CI_COMMIT_SHA,
} = process.env;

const region = process.env.AWS_REGION as AWS['provider']['region'];
const envAlias = SLS_STAGE === 'production' ? 'prod' : 'dev';
const envRef =
  SLS_STAGE === 'production'
    ? 'prod'
    : SLS_STAGE === 'dev'
    ? 'dev'
    : `CI-${SLS_STAGE}`;

const service = paramCase(pkg.name);
export const plugins = [
  'serverless-s3-sync',
  'serverless-iam-roles-per-function',
  'serverless-webpack',
];

const serverlessConfig: AWS = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    timeout: 16,
    memorySize: 512,
    region,
    stage: SLS_STAGE,
    httpApi: {
      payload: '2.0',
      cors: {
        allowedOrigins: [ASAP_APP_URL],
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
    eventBridge: {
      useCloudFormation: true,
    },
    environment: {
      APP_ORIGIN: ASAP_APP_URL,
      DEBUG: SLS_STAGE === 'production' ? '' : 'asap-server,http',
      NODE_ENV: '${env:NODE_ENV}',
      ENVIRONMENT: '${env:SLS_STAGE}',
      LIGHTSTEP_TOKEN: '${env:LIGHTSTEP_TOKEN}',
      SQUIDEX_APP_NAME: '${env:SQUIDEX_APP_NAME}',
      SQUIDEX_BASE_URL: '${env:SQUIDEX_BASE_URL}',
      SQUIDEX_CLIENT_ID: '${env:SQUIDEX_CLIENT_ID}',
      SQUIDEX_CLIENT_SECRET: '${env:SQUIDEX_CLIENT_SECRET}',
      SQUIDEX_SHARED_SECRET: '${env:SQUIDEX_SHARED_SECRET}',
      REGION: '${env:AWS_REGION}',
      ASAP_API_URL: '${env:ASAP_API_URL}',
      LOG_LEVEL: SLS_STAGE === 'production' ? 'error' : 'info',
      NODE_OPTIONS: '--enable-source-maps',
      ALGOLIA_APP_ID: `\${ssm:algolia-app-id-${envAlias}}`,
      CURRENT_REVISION: CI_COMMIT_SHA
        ? '${env:CI_COMMIT_SHA}'
        : '${env:CURRENT_REVISION}',
    },
    iamRoleStatements: [
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
  package: {
    individually: true,
    excludeDevDependencies: false,
  },
  custom: {
    apiHostname: new URL(ASAP_API_URL).hostname,
    appHostname: new URL(ASAP_APP_URL).hostname,
    s3Sync: [
      {
        bucketName: '${self:service}-${self:provider.stage}-frontend',
        deleteRemoved: false,
        localDir: 'apps/frontend/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-auth-frontend',
        bucketPrefix: '.auth',
        localDir: 'apps/auth-frontend/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-storybook',
        bucketPrefix: '.storybook',
        localDir: 'apps/storybook/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-messages-static',
        deleteRemoved: false,
        bucketPrefix: '.messages-static',
        localDir: 'apps/messages/build-templates/static',
      },
    ],
    webpack: {
      config: 'serverless/webpack.config.js',
    },
  },
  functions: {
    apiHandler: {
      handler: 'apps/asap-server/src/handlers/api-handler.apiHandler',
      events: [
        {
          httpApi: {
            method: '*',
            path: '*',
          },
        },
      ],
      environment: {
        SENTRY_DSN: '${env:SENTRY_DSN_API}',
      },
    },
    auth0FetchByCode: {
      handler:
        'apps/asap-server/src/handlers/webhooks/fetch-by-code/handler.handler',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/webhook/users/{code}',
          },
        },
      ],
      environment: {
        AUTH0_CLIENT_ID: `\${ssm:auth0-client-id-${envAlias}}`,
        AUTH0_SHARED_SECRET: `\${ssm:auth0-shared-secret-${envAlias}}`,
        ALGOLIA_API_KEY: `\${ssm:algolia-search-api-key-${envAlias}}`,
      },
    },
    auth0ConnectByCode: {
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-connect-by-code.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/users/connections',
          },
        },
      ],
      environment: {
        AUTH0_CLIENT_ID: `\${ssm:auth0-client-id-${envAlias}}`,
        AUTH0_SHARED_SECRET: `\${ssm:auth0-shared-secret-${envAlias}}`,
      },
    },
    syncUserOrcid: {
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-sync-orcid.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/users/orcid',
          },
        },
      ],
    },
    subscribeCalendar: {
      handler:
        'apps/asap-server/src/handlers/calendar/subscribe-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: ['asap.calendar'],
              'detail-type': ['CalendarCreated', 'CalendarUpdated'],
            },
          },
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
        SENTRY_DSN: '${env:SENTRY_DSN_CALENDAR}',
      },
    },
    resubscribeCalendars: {
      handler:
        'apps/asap-server/src/handlers/calendar/resubscribe-handler.handler',
      timeout: 120,
      events: [
        {
          schedule: 'cron(0 1 * * ? *)',
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${envAlias}`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${envAlias}}`,
      },
    },
    inviteUser: {
      handler: 'apps/asap-server/src/handlers/user/invite-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: ['asap.user'],
              'detail-type': ['UserPublished'],
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
        SENTRY_DSN: '${env:SENTRY_DSN_USER_INVITE}',
      },
    },
    indexResearchOutput: {
      handler:
        'apps/asap-server/src/handlers/research-output/index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: ['asap.research-output'],
              'detail-type': [
                'ResearchOutputCreated',
                'ResearchOutputUpdated',
                'ResearchOutputDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `asap-hub_research_outputs_${envRef}`,
      },
    },
    indexUser: {
      handler: 'apps/asap-server/src/handlers/user/index-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: ['asap.user'],
              'detail-type': [
                'UserPublished',
                'UserUpdated',
                'UserCreated',
                'UserDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `asap-hub_${envRef}`,
      },
    },
    labUpserted: {
      handler: 'apps/asap-server/src/handlers/webhooks/webhook-lab.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/labs',
          },
        },
      ],
      environment: {
        EVENT_BUS: 'asap-events-${self:provider.stage}',
        EVENT_SOURCE: 'asap.lab',
      },
    },
    indexLabUsers: {
      handler:
        'apps/asap-server/src/handlers/lab/index-lab-users-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: ['asap.lab'],
              'detail-type': [
                'LabCreated',
                'LabPublished',
                'LabUpdated',
                'LabDeleted',
              ],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `asap-hub_${envRef}`,
      },
    },
    eventsUpdated: {
      timeout: 300,
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-events-updated.handler',
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
      },
    },
    runMigrations: {
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-run-migrations.run',
      timeout: 900,
    },
    rollbackMigrations: {
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-run-migrations.rollback',
      timeout: 900,
    },
    calendarUpserted: {
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-calendar.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/calendars',
          },
        },
      ],
      environment: {
        EVENT_BUS: 'asap-events-${self:provider.stage}',
        EVENT_SOURCE: 'asap.calendar',
      },
    },
    userUpserted: {
      handler: 'apps/asap-server/src/handlers/webhooks/webhook-user.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/users',
          },
        },
      ],
      environment: {
        EVENT_BUS: 'asap-events-${self:provider.stage}',
        EVENT_SOURCE: 'asap.user',
      },
    },
    researchOutputUpserted: {
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-research-output.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/research-outputs',
          },
        },
      ],
      environment: {
        EVENT_BUS: 'asap-events-${self:provider.stage}',
        EVENT_SOURCE: 'asap.research-output',
      },
    },
    teamUpserted: {
      handler: 'apps/asap-server/src/handlers/webhooks/webhook-teams.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/teams',
          },
        },
      ],
      environment: {
        EVENT_BUS: 'asap-events-${self:provider.stage}',
        EVENT_SOURCE: 'asap.teams',
      },
    },
    invalidateCache: {
      handler:
        'apps/asap-server/src/handlers/invalidate-cache/invalidate-handler.handler',
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
      },
    },
    indexTeamResearchOutputs: {
      handler:
        'apps/asap-server/src/handlers/teams/index-team-reasearch-outputs-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: ['asap.teams'],
              'detail-type': ['TeamsCreated', 'TeamsUpdated', 'TeamsDeleted'],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `asap-hub_research_outputs_${envRef}`,
      },
    },
    indexTeamUsers: {
      handler:
        'apps/asap-server/src/handlers/teams/index-team-users-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus: 'asap-events-${self:provider.stage}',
            pattern: {
              source: ['asap.teams'],
              'detail-type': ['TeamsCreated', 'TeamsUpdated', 'TeamsDeleted'],
            },
          },
        },
      ],
      environment: {
        ALGOLIA_API_KEY: `\${ssm:algolia-index-api-key-${envAlias}}`,
        ALGOLIA_INDEX: `asap-hub_${envRef}`,
      },
    },
    ...(NODE_ENV === 'production'
      ? {
          cronjobSyncOrcid: {
            handler:
              'apps/asap-server/src/handlers/webhooks/cronjob-sync-orcid.handler',
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
              CertificateArn: AWS_ACM_CERTIFICATE_ARN,
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
              AcmCertificateArn: AWS_ACM_CERTIFICATE_ARN,
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
