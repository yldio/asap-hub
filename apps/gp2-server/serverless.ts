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
  'SQUIDEX_APP_NAME',
  'SQUIDEX_BASE_URL',
  'SQUIDEX_CLIENT_ID',
  'SQUIDEX_CLIENT_SECRET',
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
const squidexAppName = process.env.SQUIDEX_APP_NAME!;
const squidexBaseUrl = process.env.SQUIDEX_BASE_URL!;
const squidexClientId = process.env.SQUIDEX_CLIENT_ID!;
const squidexClientSecret = process.env.SQUIDEX_CLIENT_SECRET!;
const stage = process.env.SLS_STAGE!;

const service = 'gp2-hub';
const appHostname = stage === 'production' ? hostname : `${stage}.${hostname}`;
const apiHostname =
  stage === 'production' ? `api.${hostname}` : `api-${stage}.${hostname}`;
const appUrl = `https://${appHostname}`;

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
      SQUIDEX_APP_NAME: squidexAppName,
      SQUIDEX_BASE_URL: squidexBaseUrl,
      SQUIDEX_CLIENT_ID: squidexClientId,
      SQUIDEX_CLIENT_SECRET: squidexClientSecret,
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
      },
    },
  },
  resources: {
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
      CloudFrontDistribution: {
        Type: 'AWS::CloudFront::Distribution',
        DependsOn: ['FrontendBucket', 'AuthFrontendBucket'],
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
