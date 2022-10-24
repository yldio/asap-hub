import { AWS } from '@serverless/typescript';
import assert from 'assert';

[
  'AWS_REGION',
  'GP2_AUTH0_AUDIENCE',
  'GP2_AUTH0_CLIENT_ID',
  'GP2_AUTH0_SHARED_SECRET',
  'GP2_AWS_ACM_CERTIFICATE_ARN',
  'GP2_HOSTNAME',
  'SLS_STAGE',
  'GP2_SQUIDEX_APP_NAME',
  'SQUIDEX_BASE_URL',
  'GP2_SQUIDEX_API_CLIENT_ID',
  'GP2_SQUIDEX_API_CLIENT_SECRET',
  'GP2_SQUIDEX_SHARED_SECRET',
  'GP2_SENTRY_DSN_API',
  'GP2_SENTRY_DSN_HANDLERS',
].forEach((env) => {
  assert.ok(process.env[env], `${env} not defined`);
});

assert.ok(
  process.env.SLS_STAGE === 'dev' ||
    process.env.SLS_STAGE === 'production' ||
    !isNaN(Number.parseInt(process.env.SLS_STAGE!)),
  'SLS_STAGE must be either "dev" or "production" or a PR number',
);

const auth0Audience = process.env.GP2_AUTH0_AUDIENCE!;
const auth0ClientId = process.env.GP2_AUTH0_CLIENT_ID!;
const auth0SharedSecret = process.env.GP2_AUTH0_SHARED_SECRET!;
const gp2AwsAcmCertificateArn = process.env.GP2_AWS_ACM_CERTIFICATE_ARN!;
const hostname = process.env.GP2_HOSTNAME!;
const region = process.env.AWS_REGION as AWS['provider']['region'];
const squidexAppName = process.env.GP2_SQUIDEX_APP_NAME!;
const squidexBaseUrl = process.env.SQUIDEX_BASE_URL!;
const squidexClientId = process.env.GP2_SQUIDEX_API_CLIENT_ID!;
const squidexClientSecret = process.env.GP2_SQUIDEX_API_CLIENT_SECRET!;
const squidexSharedSecret = process.env.GP2_SQUIDEX_SHARED_SECRET!;
const stage = process.env.SLS_STAGE!;
const sentryDsnApi = process.env.GP2_SENTRY_DSN_API!;
const sentryDsnHandlers = process.env.GP2_SENTRY_DSN_HANDLERS!;

const envAlias = process.env.SLS_STAGE === 'production' ? 'prod' : 'dev';
const eventBus = `gp2-events-${stage}`;
const eventBusSource = 'asap.entity-updated';

const service = 'gp2-hub';
const appHostname = stage === 'production' ? hostname : `${stage}.${hostname}`;
const apiHostname =
  stage === 'production' ? `api.${hostname}` : `api-${stage}.${hostname}`;
const appUrl = `https://${appHostname}`;
const currentRevision = process.env.CI_COMMIT_SHA;
const nodeEnv = 'production';

export const plugins = [
  './serverless-plugins/serverless-webpack',
  './serverless-plugins/serverless-s3-sync',
];

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
    stage,
    httpApi: {
      payload: '2.0',
      cors: {
        allowedOrigins: [appUrl],
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
    environment: {
      NODE_ENV: nodeEnv,
      SQUIDEX_APP_NAME: squidexAppName,
      SQUIDEX_BASE_URL: squidexBaseUrl,
      SQUIDEX_CLIENT_ID: squidexClientId,
      SQUIDEX_CLIENT_SECRET: squidexClientSecret,
      SQUIDEX_SHARED_SECRET: squidexSharedSecret,
      LOG_LEVEL: stage === 'production' ? 'error' : 'info',
      APP_ORIGIN: appUrl,
      ENVIRONMENT: '${env:SLS_STAGE}',
      CURRENT_REVISION: currentRevision
        ? '${env:CI_COMMIT_SHA}'
        : '${env:CURRENT_REVISION}',
    },
    iam: {
      role: {
        statements: [
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
                  `event-bus/${eventBus}`,
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
    webpack: {
      config: './webpack.config.js',
      packager: 'yarn',
    },
    s3Sync: [
      {
        bucketName: '${self:service}-${self:provider.stage}-gp2-frontend',
        deleteRemoved: false,
        localDir: '../gp2-frontend/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-gp2-auth-frontend',
        bucketPrefix: '.auth',
        localDir: '../gp2-auth-frontend/build',
      },
      {
        bucketName: '${self:service}-${self:provider.stage}-messages-static',
        deleteRemoved: false,
        bucketPrefix: '.messages-static',
        localDir: '../gp2-messages/build-templates/static',
      },
    ],
  },
  functions: {
    apiHandler: {
      handler: 'src/handlers/api-handler.apiHandler',
      events: [
        {
          httpApi: {
            method: '*',
            path: '*',
          },
        },
      ],
      environment: {
        APP_ORIGIN: appUrl,
        AUTH0_AUDIENCE: auth0Audience,
        AUTH0_CLIENT_ID: auth0ClientId,
        SENTRY_DSN: sentryDsnApi,
      },
    },
    auth0FetchByCode: {
      handler: './src/handlers/webhooks/fetch-by-code-handler.handler',
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
        AUTH0_SHARED_SECRET: auth0SharedSecret,
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
        AUTH0_SHARED_SECRET: auth0SharedSecret,
        SENTRY_DSN: sentryDsnHandlers,
      },
    },
    inviteUser: {
      handler: './src/handlers/user/invite-handler.handler',
      events: [
        {
          eventBridge: {
            eventBus,
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
        EMAIL_SENDER: `\${ssm:email-invite-sender-gp2-${envAlias}}`,
        EMAIL_BCC: `\${ssm:email-invite-bcc-gp2-${envAlias}}`,
        EMAIL_RETURN: `\${ssm:email-invite-return-gp2-${envAlias}}`,
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
        EVENT_BUS: eventBus,
        EVENT_SOURCE: eventBusSource,
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
          DomainName: apiHostname,
          DomainNameConfigurations: [
            {
              CertificateArn: gp2AwsAcmCertificateArn,
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
          DomainName: apiHostname,
          Stage: { Ref: 'HttpApiStage' },
        },
      },
      HttpApiRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${hostname}.`,
          RecordSets: [
            {
              Name: apiHostname,
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
          BucketName: '${self:service}-${self:provider.stage}-gp2-frontend',
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
          BucketName:
            '${self:service}-${self:provider.stage}-gp2-auth-frontend',
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
          Bucket: '${self:service}-${self:provider.stage}-gp2-frontend',
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
          Bucket: '${self:service}-${self:provider.stage}-gp2-auth-frontend',
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
          'MessagesStaticBucket',
        ],
        Properties: {
          DistributionConfig: {
            Aliases: [appHostname],
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
              AcmCertificateArn: gp2AwsAcmCertificateArn,
              MinimumProtocolVersion: 'TLSv1.2_2018',
              SslSupportMethod: 'sni-only',
            },
          },
        },
      },
      CloudFrontRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${hostname}.`,
          RecordSets: [
            {
              Name: appHostname,
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
