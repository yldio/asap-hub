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
} = process.env;

const region = process.env.AWS_REGION as AWS['provider']['region'];

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
      },
    },
    tracing: {
      apiGateway: true,
      lambda: true,
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
      ALGOLIA_APP_ID: `\${ssm:algolia-app-id-${
        SLS_STAGE === 'production' ? 'prod' : 'dev'
      }}`,
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
              `google-api-credentials-${
                SLS_STAGE === 'production' ? 'prod' : 'dev'
              }*`,
            ],
          ],
        },
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
    },
    auth0FetchByCode: {
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-fetch-by-code.handler',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/webhook/users/{code}',
          },
        },
      ],
      environment: {
        AUTH0_CLIENT_ID: `\${ssm:auth0-client-id-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }}`,
        AUTH0_SHARED_SECRET: `\${ssm:auth0-shared-secret-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }}`,
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
        AUTH0_CLIENT_ID: `\${ssm:auth0-client-id-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }}`,
        AUTH0_SHARED_SECRET: `\${ssm:auth0-shared-secret-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }}`,
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
    calendarCreated: {
      handler:
        'apps/asap-server/src/handlers/webhooks/webhook-calendar-created.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/webhook/calendar',
          },
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }}`,
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
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }}`,
      },
    },
    resubscribeCalendars: {
      handler:
        'apps/asap-server/src/handlers/jobs/resubscribe-calendars.handler',
      timeout: 120,
      events: [
        {
          schedule: {
            rate: 'cron(0 1 * * ? *)',
          },
        },
      ],
      environment: {
        GOOGLE_API_CREDENTIALS_SECRET_ID: `google-api-credentials-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }`,
        GOOGLE_API_TOKEN: `\${ssm:google-api-token-${
          SLS_STAGE === 'production' ? 'prod' : 'dev'
        }}`,
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
    },
  },
};

module.exports = serverlessConfig;
