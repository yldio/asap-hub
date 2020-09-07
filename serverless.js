const assert = require('assert');
const { paramCase } = require('param-case');

const pkg = require('./package.json');

const { NODE_ENV = 'development' } = process.env;

if (NODE_ENV === 'production') {
  [
    'ASAP_API_URL',
    'ASAP_APP_URL',
    'AWS_ACM_CERTIFICATE_ARN',
    'GLOBAL_TOKEN',
  ].forEach((env) => {
    assert.ok(process.env[env], `${env} not defined`);
  });
}

const {
  ASAP_APP_URL = 'http://localhost:3000',
  ASAP_API_URL = 'http://localhost:3333',
  ASAP_HOSTNAME = 'hub.asap.science',
  AWS_ACM_CERTIFICATE_ARN,
  AWS_REGION = 'us-east-1',
  SLS_STAGE = 'development',
} = process.env;

const service = paramCase(pkg.name);
const plugins = [
  'serverless-s3-sync',
  'serverless-iam-roles-per-function',
  ...(NODE_ENV === 'production'
    ? ['serverless-webpack']
    : ['serverless-offline']),
];

module.exports = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    timeout: 16,
    memorySize: 512,
    region: AWS_REGION,
    stage: SLS_STAGE,
    httpApi: {
      cors: {
        allowedOrigins: [ASAP_APP_URL],
        allowCredentials: true,
      },
    },
    environment: {
      APP_ORIGIN: ASAP_APP_URL,
      AUTH0_SHARED_SECRET: `\${env:AUTH0_SHARED_SECRET}`,
      NODE_ENV: `\${env:NODE_ENV}`,
      SQUIDEX_APP_NAME: `\${env:SQUIDEX_APP_NAME}`,
      SQUIDEX_BASE_URL: `\${env:SQUIDEX_BASE_URL}`,
      SQUIDEX_CLIENT_ID: `\${env:SQUIDEX_CLIENT_ID}`,
      SQUIDEX_CLIENT_SECRET: `\${env:SQUIDEX_CLIENT_SECRET}`,
      SQUIDEX_SHARED_SECRET: `\${env:SQUIDEX_SHARED_SECRET}`,
    },
  },
  package: {
    individually: false,
    excludeDevDependencies: false,
  },
  custom: {
    apiHostname: new URL(ASAP_API_URL).hostname,
    appHostname: new URL(ASAP_APP_URL).hostname,
    s3Sync: [
      {
        bucketName: `\${self:service}-\${self:provider.stage}-frontend`,
        deleteRemoved: false,
        localDir: 'apps/frontend/build',
      },
      {
        bucketName: `\${self:service}-\${self:provider.stage}-auth-frontend`,
        bucketPrefix: '.auth',
        localDir: 'apps/auth-frontend/build',
      },
      {
        bucketName: `\${self:service}-\${self:provider.stage}-storybook`,
        bucketPrefix: '.storybook',
        localDir: 'apps/storybook/build',
      },
    ],
    webpack: {
      config: 'serverless/webpack.config.js',
    },
    'serverless-offline': {
      useChildProcesses: true, // needed for hot reloading to work https://github.com/dherault/serverless-offline/issues/931
    },
  },
  functions: {
    'create-user': {
      handler: 'apps/asap-server/build/handlers/users/create.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'POST',
            path: `/users`,
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['ses:SendTemplatedEmail'],
          Resource: '*',
        },
      ],
      environment: {
        GLOBAL_TOKEN: `\${env:GLOBAL_TOKEN}`,
      },
    },
    'fetch-users': {
      handler: 'apps/asap-server/build/handlers/users/fetch.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/users`,
          },
        },
      ],
    },
    'fetch-user-by-id': {
      handler: 'apps/asap-server/build/handlers/users/fetch-by-id.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/users/{id}`,
          },
        },
      ],
    },
    'fetch-user-by-code': {
      handler: 'apps/asap-server/build/handlers/users/fetch-by-code.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/users/invites/{code}`,
          },
        },
      ],
    },
    'fetch-me': {
      handler: 'apps/asap-server/build/handlers/users/fetch-me.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/users/me`,
          },
        },
      ],
    },
    'connect-by-code': {
      handler: 'apps/asap-server/build/handlers/users/connect-by-code.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'POST',
            path: `/users/connections`,
          },
        },
      ],
    },
    'webhook-fetch-by-code': {
      handler:
        'apps/asap-server/build/handlers/users/webhook-fetch-by-code.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/webhook/users/{code}`,
          },
        },
      ],
    },
    'webhook-connect-by-code': {
      handler:
        'apps/asap-server/build/handlers/users/webhook-connect-by-code.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'POST',
            path: `/webhook/users/connections`,
          },
        },
      ],
    },
    'sync-user-orcid': {
      handler:
        'apps/asap-server/build/handlers/users/webhook-sync-orcid.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'POST',
            path: `/webhook/users/orcid`,
          },
        },
      ],
    },
    'create-research-output': {
      handler:
        'apps/asap-server/build/handlers/research-outputs/create.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'POST',
            path: `/users/{id}/research-outputs`,
          },
        },
      ],
    },
    'fetch-research-outputs': {
      handler:
        'apps/asap-server/build/handlers/research-outputs/fetch-by-id.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/users/{id}/research-outputs`,
          },
        },
      ],
    },
    'fetch-page': {
      handler: 'apps/asap-server/build/handlers/pages/fetch.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/pages/{path+}`,
          },
        },
      ],
    },
    'fetch-content-by-slug': {
      handler: 'apps/asap-server/build/handlers/content/fetch-by-slug.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/content/{content}/{slug}`,
          },
        },
      ],
    },
    'fetch-teams': {
      handler: 'apps/asap-server/build/handlers/teams/fetch.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/teams`,
          },
        },
      ],
    },
    'fetch-team-by-id': {
      handler: 'apps/asap-server/build/handlers/teams/fetch-by-id.handler',
      events: [
        {
          // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
          httpApi: {
            method: 'GET',
            path: `/teams/{id}`,
          },
        },
      ],
    },
    ...(NODE_ENV === 'production'
      ? {
          'cronjob-sync-orcid': {
            handler:
              'apps/asap-server/build/handlers/users/cronjob-sync-orcid.handler',
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
    Resources: {
      HttpApiDomain: {
        Type: 'AWS::ApiGatewayV2::DomainName',
        Properties: {
          DomainName: `\${self:custom.apiHostname}`,
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
          DomainName: `\${self:custom.apiHostname}`,
          Stage: { Ref: 'HttpApiStage' },
        },
      },
      HttpApiRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${ASAP_HOSTNAME}.`,
          RecordSets: [
            {
              Name: `\${self:custom.apiHostname}`,
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
          BucketName: `\${self:service}-\${self:provider.stage}-frontend`,
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
          BucketName: `\${self:service}-\${self:provider.stage}-auth-frontend`,
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
          BucketName: `\${self:service}-\${self:provider.stage}-storybook`,
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
      BucketPolicyFrontend: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: `\${self:service}-\${self:provider.stage}-frontend`,
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
          Bucket: `\${self:service}-\${self:provider.stage}-auth-frontend`,
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
          Bucket: `\${self:service}-\${self:provider.stage}-storybook`,
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
      CloudFrontDistribution: {
        Type: 'AWS::CloudFront::Distribution',
        DependsOn: ['FrontendBucket', 'AuthFrontendBucket', 'StorybookBucket'],
        Properties: {
          DistributionConfig: {
            Aliases: [`\${self:custom.appHostname}`],
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
              Name: `\${self:custom.appHostname}`,
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
