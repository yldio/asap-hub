const { paramCase } = require('param-case');
const pkg = require('./package.json');

const { NODE_ENV = 'development' } = process.env;

const service = paramCase(pkg.name);
const plugins = [
  'serverless-s3-sync',
  ...(NODE_ENV === 'production'
    ? ['serverless-plugin-ncc']
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
    region: `\${env:AWS_REGION, "us-east-1"}`,
    stage: `\${env:SLS_STAGE, "development"}`,
  },
  package: {
    individually: true,
    // we don't need this because of ncc
    excludeDevDependencies: false,
  },
  custom: {
    s3Sync: [
      {
        bucketName: `\${self:service}-\${self:provider.stage}-frontend`,
        localDir: 'apps/frontend/build',
      },
    ],
    s3Sync: [
      {
        bucketName: `\${self:service}-\${self:provider.stage}-storybook`,
        localDir: 'apps/storybook/build',
      },
    ],
  },
  functions: {
    error: {
      handler: 'apps/hello-world/build/handler.error',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/api/error',
            cors: {
              origin: {
                'Fn::Join': [
                  '',
                  [
                    'https://',
                    {
                      'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
                    },
                  ],
                ],
              },
              headers: ['*'],
              allowCredentials: false,
            },
          },
        },
      ],
    },
    helloWorld: {
      handler: 'apps/hello-world/build/handler.hello',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/api/hello',
            cors: {
              origin: {
                'Fn::Join': [
                  '',
                  [
                    'https://',
                    {
                      'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
                    },
                  ],
                ],
              },
              headers: ['*'],
              allowCredentials: false,
            },
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
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
        DependsOn: ['FrontendBucket', 'StorybookBucket', 'HttpApi'],
        Properties: {
          DistributionConfig: {
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
                  'Fn::GetAtt': ['StorybookBucket', 'RegionalDomainName'],
                },
                Id: 's3origin-storybook',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/.storybook/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentityStorybook' },
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
                AllowedMethods: [
                  'HEAD',
                  'DELETE',
                  'POST',
                  'GET',
                  'OPTIONS',
                  'PUT',
                  'PATCH',
                ],
                CachedMethods: ['HEAD', 'GET', 'OPTIONS'],
                Compress: true,
                DefaultTTL: 0,
                ForwardedValues: {
                  Headers: ['Authorization', 'authorization'],
                  Cookies: {
                    Forward: 'all',
                  },
                  QueryString: true,
                },
                MaxTTL: 0,
                MinTTL: 0,
                PathPattern: '/api/*',
                TargetOriginId: 'apigw',
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
                PathPattern: '/.storybook/*',
                TargetOriginId: 's3origin-storybook',
                ViewerProtocolPolicy: 'redirect-to-https',
              },
            ],
            DefaultRootObject: 'index.html',
            Enabled: true,
            PriceClass: 'PriceClass_100',
            ViewerCertificate: {
              CloudFrontDefaultCertificate: true,
            },
          },
        },
      },
    },
    Outputs: {
      FrontendBucketName: {
        Value: `\${self:service}-\${self:provider.stage}-frontend`,
      },
      StorybookBucketName: {
        Value: `\${self:service}-\${self:provider.stage}-frontend`,
      },
      CloudFrontDistributionDomain: {
        Value: {
          'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
        },
      },
    },
  },
};
