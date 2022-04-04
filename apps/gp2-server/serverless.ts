import assert from 'assert';
import { AWS } from '@serverless/typescript';

['AWS_ACM_CERTIFICATE_ARN', 'ASAP_HOSTNAME'].forEach((env) => {
  assert.ok(process.env[env], `${env} not defined`);
});

const region =
  (process.env.AWS_REGION as AWS['provider']['region']) || 'us-east-1';
const service = 'gp2-hub';
const stage = '12345-gp2';
const apiHostname = 'api-12345.gp2.asap.science';
const appHostname = '12345.gp2.asap.science';
const appUrl = `https://${appHostname}`;
const hostedZone = process.env.ASAP_HOSTNAME;
const acmCertificateArn = process.env.AWS_ACM_CERTIFICATE_ARN;

export const plugins = [
  './serverless-plugins/serverless-webpack',
  './serverless-plugins/serverless-s3-sync',
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
      SQUIDEX_APP_NAME: '${env:SQUIDEX_APP_NAME}',
      SQUIDEX_BASE_URL: '${env:SQUIDEX_BASE_URL}',
      SQUIDEX_CLIENT_ID: '${env:SQUIDEX_CLIENT_ID}',
      SQUIDEX_CLIENT_SECRET: '${env:SQUIDEX_CLIENT_SECRET}',
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
              CertificateArn: acmCertificateArn,
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
          HostedZoneName: hostedZone,
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
      CloudFrontOriginAccessIdentityFrontend: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'FrontendBucket' },
          },
        },
      },
      CloudFrontDistribution: {
        Type: 'AWS::CloudFront::Distribution',
        DependsOn: ['FrontendBucket'],
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
            CacheBehaviors: [],
            DefaultRootObject: 'index.html',
            Enabled: true,
            PriceClass: 'PriceClass_100',
            ViewerCertificate: {
              AcmCertificateArn: acmCertificateArn,
              MinimumProtocolVersion: 'TLSv1.2_2018',
              SslSupportMethod: 'sni-only',
            },
          },
        },
      },
      CloudFrontRecordSetGroup: {
        Type: 'AWS::Route53::RecordSetGroup',
        Properties: {
          HostedZoneName: hostedZone,
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
