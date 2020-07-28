const assert = require('assert');
const { paramCase } = require('param-case');

const pkg = require('./package.json');

const {
  APP_HOSTNAME = 'hub.asap.science',
  API_HOSTNAME = 'api.hub.asap.science',
  AWS_ACM_ASAP_SCIENCE_CERTIFICATE_ARN,
  AWS_REGION = 'us-east-1',
  BASE_HOSTNAME = 'hub.asap.science',
  GLOBAL_TOKEN,
  NODE_ENV = 'development',
  SLS_STAGE = 'development',
} = process.env;

if (NODE_ENV === 'production') {
  assert.ok(
    AWS_ACM_ASAP_SCIENCE_CERTIFICATE_ARN,
    'AWS_ACM_ASAP_SCIENCE_CERTIFICATE_ARN not defined',
  );
  assert.ok(BASE_HOSTNAME, 'BASE_HOSTNAME not defined');
  assert.ok(GLOBAL_TOKEN, 'GLOBAL_TOKEN not defined');
}

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
        allowedOrigins: [`https://${APP_HOSTNAME}`],
        allowCredentials: true,
      },
    },
    environment: {
      APP_ORIGIN: `https://${APP_HOSTNAME}`,
      NODE_ENV: `\${env:NODE_ENV}`,
      CMS_BASE_URL: `\${env:CMS_BASE_URL}`,
      CMS_APP_NAME: `\${env:CMS_APP_NAME}`,
      CMS_CLIENT_ID: `\${env:CMS_CLIENT_ID}`,
      CMS_CLIENT_SECRET: `\${env:CMS_CLIENT_SECRET}`,
    },
  },
  package: {
    individually: true,
    excludeDevDependencies: false,
  },
  custom: {
    apiHostname: API_HOSTNAME,
    appHostname: APP_HOSTNAME,
    s3Sync: [
      {
        bucketName: `\${self:service}-\${self:provider.stage}-frontend`,
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
  },
  resources: {
    Resources: {
      HttpApiDomain: {
        Type: 'AWS::ApiGatewayV2::DomainName',
        Properties: {
          DomainName: `\${self:custom.apiHostname}`,
          DomainNameConfigurations: [
            {
              CertificateArn: AWS_ACM_ASAP_SCIENCE_CERTIFICATE_ARN,
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
          HostedZoneName: `${BASE_HOSTNAME}.`,
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
              AcmCertificateArn: AWS_ACM_ASAP_SCIENCE_CERTIFICATE_ARN,
              MinimumProtocolVersion: 'TLSv1.2_2018',
              SslSupportMethod: 'sni-only',
            },
          },
        },
      },
      CloudFrontRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: `${BASE_HOSTNAME}.`,
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
